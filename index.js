const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTODOs(file) {
    let answer = [];
    for (let row in file.split('\n')) {
        const TODOBeginning = '// TODO ';
        let i = row.lastIndexOf();
        if (i < 0) {
            continue;
        }
        answer.push(row.substring(i + TODOBeginning.length));
    }
    return answer;
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'todos':
            console.log(getFiles().map(getTODOs));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
