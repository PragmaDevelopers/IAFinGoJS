/* Pequena ferramenta CLI para auxiliar na geração de submodulos pro workspace
atualmente só tem duas flags:
	- addmod <URL>
		essa flag adiciona um modulo externo a todos os submodulos do workspace
		basicamente um "go get" inteligente, porque ele só roda nas pastas que
		contém um arquivo go.mod.
	- newmod <CAMINHO RELATIVO>
		essa flag cria um novo submodulo localmente, ela também é inteligente
		ela detecta se as pastas do caminho ja existem e se já existem go.mod's
		nelas, e pula essas pastas para evitar sobreescrita, ele também adiciona
		qualquer modulo externo anteriormente adicionado com o `addmod` para o
		novo modulo criado. O caminho para o novo modulo é relativo a pasta que
		o executavel se encontra, então para funcionar 100%, é melhor colocar
		ela na raiz do diretorio do projeto em Go.

O arquivo `clitool_linux.unix` é para plataformas baseadas em UNIX (Linux & MacOS)
e o arquivo `clitool_windows.exe` é para plataformas baseadas em DOS (Windows)

Exemplos de uso:
UNIX:
	./clitool_linux.unix -addmod golang.org/x/text
		Irá adicionar o pacote `golang.org/x/text` em todos os modulos do workspace
	./clitool_linux.unix -newmod utils/console
		Irá criar um novo modulo local em ./utils/console e também irá adicionar
		o `golang.org/x/text` para todos os novos modulos criados.

DOS:
	POWERSHELL:
		.\cli_tool.exe -addmod golang.org/x/text
			Irá adicionar o pacote `golang.org/x/text` em todos os modulos 
			do workspace
		.\cli_tool.exe -newmod utils/console
			Irá criar um novo modulo local em ./utils/console e também irá 
			adicionar o `golang.org/x/text` para todos os novos modulos criados.
	CMD:
		cli_tool.exe -addmod golang.org/x/text
			Irá adicionar o pacote `golang.org/x/text` em todos os modulos 
			do workspace
		cli_tool.exe -newmod utils/console
			Irá criar um novo modulo local em ./utils/console e também irá 
			adicionar o `golang.org/x/text` para todos os novos modulos criados.

																		- Mirai
*/

package main

import (
	"bufio"
	"flag"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

func main() {
	// Define flags
	addmod := flag.String("addmod", "", "Add a new external module to the workspace and to all submodules of it")
	newmod := flag.String("newmod", "", "Create a new module at the specified relative path")

	flag.Parse()

	// Determine which flag was set
	if *addmod != "" {
		addModule(*addmod)
	} else if *newmod != "" {
		createModule(*newmod)
	} else {
		fmt.Println("Usage:")
		fmt.Println("  -addmod <URL>: Add a new external module to the workspace and to all submodules of it")
		fmt.Println("  -newmod <RELATIVE PATH>: Create a new module at the specified relative path")
		os.Exit(1)
	}
}

func addModule(externalModule string) {
	// Walk through the directories and find go.mod files
	err := filepath.Walk(".", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// If go.mod file is found, execute `go get` in its directory
		if info.Name() == "go.mod" {
			dir := filepath.Dir(path)
			fmt.Printf("Found go.mod in %s\n", dir)

			cmd := exec.Command("go", "get", externalModule)
			cmd.Dir = dir
			cmd.Stdout = os.Stdout
			cmd.Stderr = os.Stderr

			err := cmd.Run()
			if err != nil {
				return fmt.Errorf("failed to run `go get` in %s: %v", dir, err)
			}
		}

		return nil
	})

	if err != nil {
		fmt.Printf("Error walking through directories: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Module added successfully to all submodules")
}

func createModule(relativePath string) {
	paths := strings.Split(relativePath, string(os.PathSeparator))
	basePath := "."

	for i := range paths {
		currentPath := filepath.Join(paths[:i+1]...)
		fullPath := filepath.Join(basePath, currentPath)

		if _, err := os.Stat(fullPath); os.IsNotExist(err) {
			fmt.Printf("Creating directory: %s\n", fullPath)
			err = os.MkdirAll(fullPath, os.ModePerm)
			if err != nil {
				fmt.Printf("Error creating directory: %v\n", err)
				os.Exit(1)
			}
		}

		goModPath := filepath.Join(fullPath, "go.mod")
		if _, err := os.Stat(goModPath); os.IsNotExist(err) {
			fmt.Printf("Creating go.mod in: %s\n", fullPath)
			moduleName := strings.Join(paths[:i+1], "/")
			err = createGoMod(goModPath, moduleName)
			if err != nil {
				fmt.Printf("Error creating go.mod: %v\n", err)
				os.Exit(1)
			}
		}
	}

	updateGoWork(relativePath)
	addExternalModulesToNewModule(relativePath)
	fmt.Println("New module created successfully")
}

func createGoMod(path, moduleName string) error {
	goVersion, err := getGoVersion()
	if err != nil {
		return err
	}

	content := fmt.Sprintf("module %s\n\ngo %s\n", moduleName, goVersion)
	return os.WriteFile(path, []byte(content), 0644)
}

func getGoVersion() (string, error) {
	cmd := exec.Command("go", "version")
	output, err := cmd.Output()
	if err != nil {
		return "", err
	}

	parts := strings.Fields(string(output))
	if len(parts) < 3 {
		return "", fmt.Errorf("unexpected output from `go version`")
	}

	version := strings.TrimPrefix(parts[2], "go")
	return version, nil
}

func updateGoWork(newModulePath string) {
	goWorkPath := "go.work"

	// Create go.work if it does not exist
	if _, err := os.Stat(goWorkPath); os.IsNotExist(err) {
		cmd := exec.Command("go", "work", "init")
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr

		err := cmd.Run()
		if err != nil {
			fmt.Printf("Error initializing go.work: %v\n", err)
			os.Exit(1)
		}
	}

	// Add new module to go.work
	cmd := exec.Command("go", "work", "use", newModulePath)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	err := cmd.Run()
	if err != nil {
		fmt.Printf("Error adding module to go.work: %v\n", err)
		os.Exit(1)
	}
}

func addExternalModulesToNewModule(modulePath string) {
	modules, err := getModulesFromMainGoMod()
	if err != nil {
		fmt.Printf("Error reading external modules from go.mod: %v\n", err)
		return
	}

	for _, module := range modules {
		fmt.Printf("Adding external module %s to %s\n", module, modulePath)

		cmd := exec.Command("go", "get", module)
		cmd.Dir = modulePath
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr

		err := cmd.Run()
		if err != nil {
			fmt.Printf("Error adding external module %s to %s: %v\n", module, modulePath, err)
		}
	}
}

func getModulesFromMainGoMod() ([]string, error) {
	var modules []string

	file, err := os.Open("go.mod")
	if err != nil {
		return nil, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "require") {
			parts := strings.Fields(line)
			if len(parts) >= 2 {
				modules = append(modules, parts[1])
			}
		}
	}

	return modules, scanner.Err()
}
