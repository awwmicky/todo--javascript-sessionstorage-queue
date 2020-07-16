const $todoForm = document.forms["todo_form"];
const $taskInp = document.forms["todo_form"].task_inp;
const $submitBtn = document.forms["todo_form"].submit_btn;
const $todoList = document.querySelector('.todo-list');

const empty = (elm) => elm.innerHTML = "";

let TodoDB = Queue();
renderData( TodoDB.getData() )

function Queue (
    data = [],
    head = 0, // current queue
    tail = 0, // next available
    key = 'todos_db'
) { return {

    enqueue (item) {
        /* add to the next */
        data[tail++] = item;
        this.setData()
    },

    dequeue () {
        /* remove from the top */
        if ((tail - head) <= 0) return undefined;
        const item = data[head];
        delete data[head++];
        // data[head++] = null;
        if (head === tail) { head = 0; tail = 0; }
        // setData()
        return item;
    },

    print () {
        let num = tail - 1;
        while ( num >= 0) {
            console.log(num,data[num])
            num--;
        }
    },

    swap (i,x) {
        [arr[i], arr[x]] = [arr[x], arr[i]];
    },

    size () { return tail - head },
    
    peek () { return data[tail - 1] },

    isEmpty () { return (tail === 0) ? true : false },

    serial () { return (tail) ? data[tail - 1].id + 1 : 0 },

    getData () {
        if (data.length) return data;
        const getDB = sessionStorage.getItem(key);
        data = JSON.parse(getDB) || [];
        // data = data.filter(Boolean);
        tail = (data.length) ? data.length : 0;
        // console.log(data)
        return data;
    },

    setData () {
        const setDB = JSON.stringify(data);
        sessionStorage.setItem(key,setDB)
    },

    updateData (id, val) {
        if (typeof val === 'string') data[id].item = val;
        if (typeof val === 'boolean') data[id].completed = !val;
        this.setData()
    },

    removeData (id) {
        delete data[id];
        data = data.filter(Boolean);
        tail--;
        this.setData()
    },

    removeDB () {
        sessionStorage.removeItem(key)
    }
}}

function appendDOM (elm,idx) {
    const checked = (elm.completed) ? 'task-completed' : '';
    const completed = (elm.completed) ? 'checked' : '';
    
    $todoList.insertAdjacentHTML(
        'beforeend',
        `
        <div class="task-card" data-id="${ idx }">
            <div class="task-check">
                <input 
                    type="checkbox" 
                    name="check" 
                    id="${ 'check-box-'+idx }"
                    class="check-box"
                    ${ completed }
                />
                <label 
                    for="${ 'check-box-'+idx }" 
                    class="check-mark"
                ></label>
            </div>
            <p class="task-title ${checked}" contenteditable>
                <span>${ elm.item }</span>
            </p>
            <div class="task-opts">
                <button class="edit-btn">✎</button>
                <button class="delete-btn">×</button>
            </div>
        </div>
        `
    )
}

function renderData (data) {
    // console.log(data)
    if (data instanceof Array) {
        console.log('Array:',data)
        empty($todoList)
        data.map(appendDOM)
        return;
    }
    if (data instanceof Object) {
        console.log('Object:',data)
        appendDOM(data,(TodoDB.size() - 1))
        return;
    }
}

$todoForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    const task = $taskInp.value.trim();
    if (task === "") return;
    
    const data = {
        id: TodoDB.serial(),
        item: task,
        completed: false
    }

    // console.log(data)
    TodoDB.enqueue(data)
    $todoForm.reset()
    renderData(data)
})

function completeTask (e) {
    const card = e.target.parentElement.parentElement;
    const isChecked = e.target.previousElementSibling.checked;
    const id = card.dataset.id;
    // console.log(card,id,isChecked)
    TodoDB.updateData(id,isChecked)
    const text = card.querySelector('.task-title');
    text.classList.toggle('task-completed')
}
function editTask (e) {
    const card = e.target.parentElement.parentElement;
    const text = card.querySelector('.task-title').textContent.trim();
    const id = card.dataset.id;
    // console.log(card,id,text)
    TodoDB.updateData(id,text)
}
function deleteTask (e) {
    const card = e.target.parentElement.parentElement;
    const id = card.dataset.id;
    // console.log(card,id)
    TodoDB.removeData(id)
    card.parentElement.removeChild(card)
}

$todoList.addEventListener('click', (e) => {
    if (e.target.classList.contains('check-mark')) {
        // console.dir(e.target)
        completeTask(e)
        return;
    }
    if (e.target.classList.contains('edit-btn')) {
        // console.dir(e.target)
        editTask(e)
        return;
    }
    if (e.target.classList.contains('delete-btn')) {
        // console.dir(e.target)
        deleteTask(e)
        return;
    }
})