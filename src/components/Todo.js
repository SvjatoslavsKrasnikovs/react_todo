import React, {useState, useEffect} from 'react';
import axios from 'axios';

const Todo = props => {
    //Hooks must be used at the top level of func body
    //Do not call it in nested components - use root level of func.
    //Destructured state, function used to update the state. Pass initial state as an argument to useState
    const [todoName, setTodoName] = useState('');
    const [todoList, setTodoList] = useState([]);

    //The hook below executes a funttion when the component is run for the first time
    //Technically, we just could call the code below from the component body, but it would  screw up
    //Also, we'd loose control
    //Generally, do not cause side effects in body, pass it to useEffect

    //Runs after render cycle is finished
    useEffect(() => {
        axios.get('https://react-hooks-demo-5a218.firebaseio.com/todos.json').then(resp => {
            console.log(resp);
            const todoData = resp.data;
            let todos = [];
            for (let key in todoData) {
                //The data is stored in  the name field in this case
                todos.push({id: key, name: todoData[key].name});
            }
            setTodoList(todos);
        }).catch(err => {
            console.log(err);
        });
        //cleanup
        //anonymous function tat is being executed before aplying main code
        //in this case it will be executed after each data fetch
        return () => {
            console.log('Cleanup');
        }
        //The execution is controlled using the 2nd argument that corresponds to the values that should trigger thfunction to be executed
        //Basically, only if the values below change , useEffect is getting executed
        //Passing empty array results in identical behaviour to componentDidMount() method - no items passed, no way to trigger function once again
        //to replicate componentdidupdate - add variable
    }, [todoName]);

    const inputChangeHandler = (event) => {
        setTodoName(event.target.value);
    };

    const todoAddHandler = () => {
        setTodoList(todoList.concat(todoName));
        //Note, that Firebase expects object(key-value pair)
        axios.post('https://react-hooks-demo-5a218.firebaseio.com/todos.json', {name: todoName}).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    };

    return (
        <React.Fragment>
            <input type="text" placeholder="Todo" onChange={inputChangeHandler} value={todoName}></input>
            <button type="button" onClick={todoAddHandler}>Add</button>
            <ul>
                {todoList.map(todo => (
                    <li key={todo.id}>{todo.name}</li>
                ))}
            </ul>
        </React.Fragment>
    );    
};

export default Todo;