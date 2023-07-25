const commands = ['about','pic','education']

// Read the pic.txt file
async function generateDiv(s){
    const data = await fetch('./txt/'+s+'.txt');
    const text = await data.text();
    const pre = document.createElement('pre');
    let div = document.createElement('div');
    if(s == 'pic'){
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
    console.log(terminalWidth);
    console.log(lines)
    if(s !== 'pic'){
        const pixedPerChar = 6
        for(let i = 0; i < lines.length; i++){
            if(lines[i].length * pixedPerChar > terminalWidth){
                const words = lines[i].split(' ');
                let tillWidth = 0;
                for(let j = 0; j < words.length; j++){
                    tillWidth += words[j].length * pixedPerChar;
                    if(tillWidth > terminalWidth){
                        myText += line + '\n';
                        line = words[j] + ' ';
                        tillWidth = words[j].length * pixedPerChar + pixedPerChar;
                    } else {
                        line += words[j] + ' ';
                        tillWidth += pixedPerChar;
                    }
                }

                // If the line is not empty, add it to myText
                if(line !== ''){
                    myText += line + '\n';
                }
            }else{
                myText += lines[i] + '\n';
            }
        }
        pre.textContent = myText;
    }
    return div;
}

terminal.addEventListener('click', function(){
    terminal_input.focus();
});

window.onload = async function(){

    // Create a code tag inside mypic
    let div = await generateDiv("pic");
    terminal_output.appendChild(div);

    // Create a div tag
    div = document.createElement('div');
    div.className = 'text';
    div.innerHTML = 'Just a guy who loves to code';
    terminal_output.appendChild(div);
}

terminal_input.addEventListener('keydown', async function (e) {
    if (e.keyCode == 13) {
        
        // Enter key pressed

        if(terminal_input.value.toLowerCase() == 'clear') {
            terminal_output.innerHTML = '';
            terminal_input.value = '';
            return;
        }

        let div = document.createElement('div');
        div.className = 'text';
        div.textContent = document.getElementsByClassName('terminal_input')[0].innerText + terminal_input.value;
        terminal_output.appendChild(div);
        terminal_input.value = terminal_input.value.toLowerCase();

        // If the input is an expression, includes +, -, *, /, (, )
        const expInclude = ['+', '-', '*', '/', '(', ')'];
        let isExp = false;
        for(let i = 0; i < expInclude.length; i++){
            if(terminal_input.value.includes(expInclude[i])){
                isExp = true;
                break;
            }
        }
        if(isExp){
            const div = document.createElement('div');
            div.className = 'text';
            const result = calculateExpression(terminal_input.value);
            console.log(result);
            div.textContent = result;
            terminal_output.appendChild(div);
        }

        div = await generateDiv(terminal_input.value);
        terminal_output.appendChild(div);


        

        terminal_input.value = '';
    }
});

// Expression might contain +, -, *, /, (, ), and space between numbers and operators, efficient way to calculate the result
function calculateExpression(exp){
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
function convertToPostfix(exp){
    const stack = [];
    const postfix = [];
    const priority = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2
    };

    for(let i = 0; i < exp.length; i++){
        // If the character is a number, push it to postfix
        if(!isNaN(exp[i])){
            let num = '';
            while(!isNaN(exp[i])){
                num += exp[i];
                i++;
            }
            i--;
            postfix.push(num);
        } else if(exp[i] == '('){
            stack.push(exp[i]);
        } else if(exp[i] == ')'){
            while(stack[stack.length - 1] != '('){
                postfix.push(stack.pop());
            }
            stack.pop();
        } else {
            while(stack.length > 0 && priority[stack[stack.length - 1]] >= priority[exp[i]]){
                postfix.push(stack.pop());
            }
            stack.push(exp[i]);
        }
    }

    while(stack.length > 0){
        postfix.push(stack.pop());
    }

    return postfix;
}


// Calculate the result of postfix
function calculatePostfix(postfix){
    const stack = [];
    for(let i = 0; i < postfix.length; i++){
        if(!isNaN(postfix[i])){
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
function calculate(num1, num2, operator){
    num1 = parseInt(num1);
    num2 = parseInt(num2);
    switch(operator){
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            if(num2 == 0){
                return 'Divided by zero';
            }
            return num1 / num2;
    }
}