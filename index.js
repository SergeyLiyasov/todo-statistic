const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodos() {
    let files = getFiles();
    let comments = []
    for (file of files){
        let current = [];
        let toDoIndex = file.indexOf('// TODO ');
        let newLineIndex = file.indexOf('\r', toDoIndex);
        while (toDoIndex != -1) {
            current.push(file.slice(toDoIndex, newLineIndex));
            toDoIndex = file.indexOf('// TODO ', newLineIndex);
            newLineIndex = file.indexOf('\r', toDoIndex); 
        }
        
        Array.prototype.push.apply(comments, current);
    }
    return comments;
}

let commentWithAuthorRegex = (/\/\/ TODO (?<name>[^;]+);\s?(?<date>[^;]+);\s?(?<comment>[^;]+)/);
function isCommentOfUser(comment, userName) {
    return userName.toUpperCase() ==
           comment.match(commentWithAuthorRegex)?.groups.name.toUpperCase();
}

function getDateOfComment(comment) {
    let rawDate = comment.match(commentWithAuthorRegex)?.groups.date;
    return Date.parse(rawDate);
}

function sortCommentsByDate(comments) {
    return comments.sort((a, b) => (getDateOfComment(b) - getDateOfComment(a)));
}

function sortCommentsByImportance(comments) {
    let cnts = comments.reduce((obj, val) => {
        let count = val.split("!").length - 1;
        obj[val] = (count || 0) + 1;
        return obj;
    }, {} );
    return comments.sort((a, b) => cnts[b] - cnts[a]);
}

function sortCommentsByUserNames(comments) {
    return comments.sort((a, b) =>
                a.match(commentWithAuthorRegex)?.groups.name.toLowerCase()
                ?.localeCompare(b.match(commentWithAuthorRegex)?.groups.name.toLowerCase()));
}

function processCommand(command) {
    let splitted = command.split(' ');
    let comments;
    switch (splitted[0]) {
        case 'show':
            comments = getTodos();
            console.log(comments);
            break;
        case 'important':
            comments = getTodos();
            console.log(comments.filter(x => x.indexOf('!') != -1));
            break;
        case 'sort':
            comments = getTodos();
            if (splitted[1] === 'importance'){
                comments = sortCommentsByImportance(comments);
            } else if (splitted[1] === 'user'){
                comments = sortCommentsByUserNames(comments);
            } else if (splitted[1] === 'date'){
                comments = sortCommentsByDate(comments);
            }
            console.log(comments);
            break;
        case 'user':
            comments = getTodos();
            console.log(comments.filter(x => isCommentOfUser(x, splitted[1])));
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
