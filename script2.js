const commands = ['about', 'pic', 'education', 'experience', 'projects', 'activities', 'additional', 'help', 'bold','animate','random_theme','clear'];
const history = [];
let upIndex = 0;
let animate = false;
let side_bar_width_percentage = 0;
let bold = false

let pixedPerChar = 6.5;

const two_color_contrast_themes = [["#00203FFF", "#ADEFD1FF"], ["#0B0033FF", "#F9F871FF"],["#00539C","#EEA47F"],["#2F3C7E","#FBEAEB"],["#F96167","#F9E795"],["#CCF381","#4831D4"],["#E2D1F9","#317773"],["#990011","#FCF6F5"]]

// Add text character by character to the given ele
async function addText(ele, text) {
    let i = 0
    const interval = setInterval(function () {
        if (i < text.length) {
            ele.textContent += text[i];
            i++;
        }
        terminal_container.scrollTop = terminal_container.scrollHeight;
    }, 10);

    // Wait until the text is added
    await new Promise(resolve => setTimeout(resolve, text.length * 10));
    clearInterval(interval);
}

// Read the pic.txt file return text
async function readTextFile(file) {
    try {
        const data = await fetch('./txt/' + file + '.txt');

        // If the file is not found, return an error message
        if (data.status != 200) {
            throw new Error('File not found');
        }

        const text = await data.text();

        // Split long text into multiple lines, 
        const lines = text.split('\n');
        let line = '';
        let myText = '';

        // Get the terminal width
        const terminalWidth = terminal.clientWidth;
        if (file !== 'pic') {
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].length * pixedPerChar > terminalWidth) {
                    const words = lines[i].split(' ');
                    let tillWidth = 0;
                    for (let j = 0; j < words.length; j++) {
                        tillWidth += words[j].length * pixedPerChar;
                        if (tillWidth > terminalWidth) {
                            myText += line + '\n';
                            line = words[j] + ' ';
                            tillWidth = words[j].length * pixedPerChar + pixedPerChar;
                        } else {
                            line += words[j] + ' ';
                            tillWidth += pixedPerChar;
                        }
                    }
                    // If the line is not empty, add it to myText
                    if (line !== '') {
                        myText += line + '\n';
                        line = '';
                    }
                } else {
                    myText += lines[i] + '\n';
                }
            }
            return myText;
        } else {
            return text;
        }
    } catch (err) {
        console.log(err);
        return 'Command not found';
    }
}

// Read the pic.txt file
async function generateDiv(s) {
    try {
        const data = await fetch('./txt/' + s + '.txt');

        // If the file is not found, return an error message
        if (data.status != 200) {
            throw new Error('File not found');
        }

        const text = await data.text();
        const pre = document.createElement('pre');
        let div = document.createElement('div');
        if (s == 'pic') {
            div.className = 'mypic';
        } else {
            div.className = 'text';
        }
        div.appendChild(pre);
        pre.textContent = text;

        // Split long text into multiple lines, 
        const lines = text.split('\n');
        let lineNum = 0;
        let line = '';
        let myText = '';

        // Get the terminal width
        const terminalWidth = terminal.clientWidth;
        if (s !== 'pic') {
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].length * pixedPerChar > terminalWidth) {
                    const words = lines[i].split(' ');
                    let tillWidth = 0;
                    for (let j = 0; j < words.length; j++) {
                        tillWidth += words[j].length * pixedPerChar;
                        if (tillWidth > terminalWidth) {
                            myText += line + '\n';
                            line = words[j] + ' ';
                            tillWidth = words[j].length * pixedPerChar + pixedPerChar;
                        } else {
                            line += words[j] + ' ';
                            tillWidth += pixedPerChar;
                        }
                    }

                    // If the line is not empty, add it to myText
                    if (line !== '') {
                        myText += line + '\n';
                        line = '';
                    }
                } else {
                    myText += lines[i] + '\n';
                }
            }
            pre.textContent = myText;
        }
        return div;
    } catch (err) {
        const div = document.createElement('div');
        div.className = 'text';
        div.textContent = 'Command not found';
        return div;
    }
}

terminal_container.addEventListener('click', function () {
    terminal_input.focus();
});

window.onload = async function () {

    // Create a code tag inside mypic
    const data = await readTextFile("pic");
    const pre = document.createElement('pre');
    let div = document.createElement('div');
    div.className = 'mypic';
    div.appendChild(pre);
    pre.textContent = data;
    terminal_output.appendChild(div);

    // Create a div tag
    div = document.createElement('div');
    div.className = 'text';
    div.innerHTML = 'Just a guy who loves to code';
    terminal_output.appendChild(div);

    div = document.createElement('div');
    div.className = 'text';
    div.innerHTML = 'help --  to get started';
    terminal_output.appendChild(div);

    // Set side bar width for different screens
    if (window.innerWidth < window.innerHeight) {
        side_bar_width_percentage = 50;
    } else {
        side_bar_width_percentage = 20;
    }

    // Set side bar width
    side_bar.style.width = side_bar_width_percentage + "%";
    side_bar.style.right = "-" + side_bar_width_percentage + "%";
}

screen.orientation.addEventListener('change', function () {
    if (window.innerWidth < window.innerHeight) {
        side_bar_width_percentage = 50;
    } else {
        side_bar_width_percentage = 20;
    }
})

terminal_input.addEventListener('keydown', async function (e) {
    if (e.keyCode == 13) {

        // Trim
        terminal_input.value = terminal_input.value.trim()

        // If the input is not empty, push it to history
        if (terminal_input.value != '') {
            history.push(terminal_input.value);
        }
        let div = document.createElement('div');
        div.className = 'text';
        div.textContent = document.getElementsByClassName('terminal_input')[0].innerText + terminal_input.value;
        terminal_output.appendChild(div);
        terminal_input.value = terminal_input.value.toLowerCase();
        switch (terminal_input.value) {
            case "": break;

            case "clear": terminal_output.innerHTML = '';
                terminal_input.value = '';
                break;

            case "bold": if (bold) {
                bold = false;
                pixedPerChar = 6.5;
                document.querySelector('body').style.fontWeight = 'normal';
                div = document.createElement('div');
                div.className = 'text';
                div.textContent = 'Text are now normal';
                terminal_output.appendChild(div);
            } else {
                bold = true;
                pixedPerChar = 8;
                document.querySelector('body').style.fontWeight = 'bold';
                div = document.createElement('div');
                div.className = 'text';
                div.textContent = 'Text are now bold';
                terminal_output.appendChild(div);
            }
                break;
            case "animate": if (animate) {
                animate = false;
                div = document.createElement('div');
                div.className = 'text';
                div.textContent = 'Animation disabled'; 
                terminal_output.appendChild(div);
            } else {
                animate = true;
                div = document.createElement('div');
                div.className = 'text';
                terminal_output.appendChild(div);
                await addText(div, 'Animation enabled');
            }
                break;
            case "random_theme":
                    const random_theme_index = Math.floor(Math.random() * two_color_contrast_themes.length);
                    const random_theme = two_color_contrast_themes[random_theme_index];
                    const background_color_index = Math.floor(Math.random() * random_theme.length);
                    const background_color = random_theme[background_color_index];
                    const text_color = random_theme[(background_color_index+1)%2];
                    document.documentElement.style.setProperty('--backgroundColor', background_color);
                    document.documentElement.style.setProperty('--textColor', background_color);
                    document.documentElement.style.setProperty('--terminalColor', text_color);
                    break;

            default:

                // If the input is an expression, includes +, -, *, /, (, )
                const expInclude = ['+', '-', '*', '/', '(', ')'];
                let isExp = false;
                for (let i = 0; i < expInclude.length; i++) {
                    if (terminal_input.value.includes(expInclude[i])) {
                        isExp = true;
                        break;
                    }
                }
                if (isExp) {
                    const div = document.createElement('div');
                    div.className = 'text';
                    const result = calculateExpression(terminal_input.value);
                    console.log(result);
                    div.textContent = result;
                    terminal_output.appendChild(div);
                } else {
                    const data = await readTextFile(terminal_input.value);
                    div = document.createElement('div');
                    if (terminal_input.value == 'pic') {
                        div.className = 'mypic';
                    } else {
                        div.className = 'text';
                    }
                    const pre = document.createElement('pre');
                    div.appendChild(pre);
                    terminal_output.appendChild(div);
                    if (animate) {
                        await addText(pre, data);
                    } else {
                        pre.textContent = data;
                    }
                }

        }

        terminal_input.value = '';
        upIndex = 0;
    }

    // If tab key is pressed
    if (e.keyCode == 9) {
        e.preventDefault();
        const input = terminal_input.value;
        const matchedCommands = commands.filter(c => c.startsWith(input));
        if (matchedCommands.length == 1) {
            terminal_input.value = matchedCommands[0]
        }
    }

    // If up key is pressed
    if (e.keyCode == 38) {
        e.preventDefault();
        if (upIndex < history.length) {
            terminal_input.value = history[history.length - 1 - upIndex];
            if (upIndex < history.length - 1)
                upIndex++;
        }
    }

    // If down key is pressed
    if (e.keyCode == 40) {
        e.preventDefault();
        if (upIndex > 0) {
            upIndex--;
            terminal_input.value = history[history.length - 1 - upIndex];
        } else {
            terminal_input.value = '';
        }
    }

    // Scroll to the bottom
    terminal_container.scrollTop = terminal_container.scrollHeight;
});



// Expression might contain +, -, *, /, (, ), and space between numbers and operators, efficient way to calculate the result
function calculateExpression(exp) {
    // Remove all the spaces
    exp = exp.replace(/\s/g, '');

    // Convert the expression to postfix
    const postfix = convertToPostfix(exp);
    console.log(postfix);

    // Calculate the result
    const result = calculatePostfix(postfix);
    return result;
}

// Convert the expression to postfix
function convertToPostfix(exp) {
    const stack = [];
    const postfix = [];
    const priority = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2
    };

    for (let i = 0; i < exp.length; i++) {
        // If the character is a number, push it to postfix
        if (!isNaN(exp[i])) {
            let num = '';
            while (!isNaN(exp[i])) {
                num += exp[i];
                i++;
            }
            i--;
            postfix.push(num);
        } else if (exp[i] == '(') {
            stack.push(exp[i]);
        } else if (exp[i] == ')') {
            while (stack[stack.length - 1] != '(') {
                postfix.push(stack.pop());
            }
            stack.pop();
        } else {
            while (stack.length > 0 && priority[stack[stack.length - 1]] >= priority[exp[i]]) {
                postfix.push(stack.pop());
            }
            stack.push(exp[i]);
        }
    }

    while (stack.length > 0) {
        postfix.push(stack.pop());
    }

    return postfix;
}


// Calculate the result of postfix
function calculatePostfix(postfix) {
    const stack = [];
    for (let i = 0; i < postfix.length; i++) {
        if (!isNaN(postfix[i])) {
            stack.push(postfix[i]);
        } else {
            const num2 = stack.pop();
            const num1 = stack.pop();
            stack.push(calculate(num1, num2, postfix[i]));
        }
    }
    return stack.pop();
}

// Calculate the result of num1 and num2
function calculate(num1, num2, operator) {
    num1 = parseInt(num1);
    num2 = parseInt(num2);
    switch (operator) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            if (num2 == 0) {
                return 'Divided by zero';
            }
            return num1 / num2;
    }
}