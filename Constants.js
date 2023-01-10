const path = require('path')

const pathToIcon = path.resolve(__dirname,"shark.ico")
const cliapp = path.resolve(__dirname, "BioAutomationCLI_v2", "dist", "main")

module.exports = { 
    pathToIcon,
    cliapp
}