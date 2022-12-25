package main

import (
	"embed"

	"github.com/go-gl/glfw/v3.2/glfw"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

type MonitorSize struct {
	Width  int
	Height int
}

func getMonitorSize() []MonitorSize {
	if err := glfw.Init(); err != nil {
		panic(err)
	}
	defer glfw.Terminate()

	ms := []MonitorSize{}
	// システム上のすべてのモニタを取得する
	monitors := glfw.GetMonitors()
	for _, monitor := range monitors {
		// モニタのサイズを取得する
		mode := monitor.GetVideoMode()
		ms = append(ms, MonitorSize{Width: int(mode.Width), Height: int(mode.Height)})
	}

	return ms
}

func main() {
	// Create an instance of the app structure
	app := NewApp()

	monitorSize := getMonitorSize()
	// Create application with options
	err := wails.Run(&options.App{
		Width:         monitorSize[0].Width,
		Height:        monitorSize[0].Height,
		DisableResize: true,
		Frameless: true,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
