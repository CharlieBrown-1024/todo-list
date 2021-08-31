let addBtn = document.querySelector("form button");
let todoList = document.querySelector("section");
// localStorage.clear();
// click add button
addBtn.addEventListener("click", (e) => {
    // prevent submittng the form
    e.preventDefault();
    // get input values
    let form = e.target.parentElement;
    let task = form.children[0].value;
    let month = form.children[1].value;
    let date = form.children[2].value;
    console.log(task, month, date);

    // reset input
    form.children[0].value = "";

    // new todo item 
    let todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");
    let todoTask = document.createElement("p");
    todoTask.classList.add("todo-task");
    todoTask.innerText = task;
    let todoTime = document.createElement("p");
    todoTime.classList.add("todo-time");
    todoTime.innerText = month + "/" + date;
    todoItem.appendChild(todoTask);
    todoItem.appendChild(todoTime);

    // create check sign and trash can
    let completeBtn = document.createElement("button");
    completeBtn.classList.add("complete");
    completeBtn.innerHTML = '<i class="fas fa-check"></i>';
    completeBtn.addEventListener("click", (e) => {
        let item = e.target.parentElement;
        item.classList.toggle("task-done");
    })

    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.addEventListener("click", (e) => {
        let item = e.target.parentElement;
        item.addEventListener("animationend", (e) => {
            let deleteTask = item.children[0].innerText;
            let array = JSON.parse(localStorage.getItem("array"));
            array.forEach((item, index) =>{
                if(item.task == deleteTask){
                    array.splice(index, 1);
                    localStorage.setItem("array", JSON.stringify(array));
                }
            })                              
            item.remove();
        })
        item.style.animation = "vanish 0.3s forwards";
    })
    todoItem.appendChild(completeBtn);
    todoItem.appendChild(deleteBtn);
    // animation pop
    todoItem.style.animation = "pop 0.3s forwards";
    

    // todo object
    todoObject={
        task: task,
        month: month,
        date: date,
    }

    // todo array
    let todoArray = localStorage.getItem("array");
    if(todoArray == null){
        localStorage.setItem("array", JSON.stringify([todoObject]));
    }
    else{
        let tempArray = JSON.parse(todoArray);
        tempArray.push(todoObject);
        localStorage.setItem("array", JSON.stringify(tempArray));
    }

    // add todo item to list
    todoList.appendChild(todoItem);
})

loadData();
// load localStorage data
function loadData(){
    let todoArray = localStorage.getItem("array");
    if(todoArray !== null){
        let tempArray = JSON.parse(todoArray);
        tempArray.forEach(item =>{
            let todoItem = document.createElement("div");
            todoItem.classList.add("todo-item");
            let todoTask = document.createElement("p");
            todoTask.classList.add("todo-task");
            todoTask.innerText = item.task;
            let todoTime = document.createElement("p");
            todoTime.classList.add("todo-time");
            todoTime.innerText = item.month + "/" + item.date;
            todoItem.appendChild(todoTask);
            todoItem.appendChild(todoTime); 

            // create check sign and trash can
            let completeBtn = document.createElement("button");
            completeBtn.classList.add("complete");
            completeBtn.innerHTML = '<i class="fas fa-check"></i>';
            completeBtn.addEventListener("click", (e) => {
                let item = e.target.parentElement;
                item.classList.toggle("task-done");
            })

            let deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete");
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.addEventListener("click", (e) => {
                let item = e.target.parentElement;
                item.addEventListener("animationend", (e) => {
                    
                    let deleteTask = item.children[0].innerText;
                    let array = JSON.parse(localStorage.getItem("array"));
                    array.forEach((item, index) =>{
                        if(item.task == deleteTask){
                            array.splice(index, 1);
                            localStorage.setItem("array", JSON.stringify(array));
                        }
                    })
                    item.remove();
                })
                item.style.animation = "vanish 0.3s forwards";
            })
            todoItem.appendChild(completeBtn);
            todoItem.appendChild(deleteBtn);
            // animation pop
            todoItem.style.animation = "pop 0.3s forwards";
            // add todo item to list
            todoList.appendChild(todoItem);
        })
        
    }
}


function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].month) > Number(arr2[j].month)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].month) < Number(arr2[j].month)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].month) == Number(arr2[j].month)){
      if (Number(arr1[i].date) > Number(arr2[j].date)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }
  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }
  return result;
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

let sortBtn = document.querySelector("div.sort button");
sortBtn.addEventListener("click", () =>{
    // sort data
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("array")));
    localStorage.setItem("array", JSON.stringify(sortedArray));

    // remove data
    let len = todoList.children.length;
    for (let i = 0; i < len; i++) {
      todoList.children[0].remove();
    }
    // load data
    loadData();
})



