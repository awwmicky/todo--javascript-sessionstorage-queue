```html
<div class="task-card" data-id="10">
    <div class="task-check">
        <input 
            type="checkbox" 
            name="check" 
            id="check-box-10"
            class="check-box"
            checked
        />
        <label 
            for="check-box-10" 
            class="check-mark"
        ></label>
    </div>
    <p class="task-title task-completed" contenteditable>
        <span>this is a task to do now</span>
    </p>
    <div class="task-opts">
        <button class="edit-btn">✎</button>
        <button class="delete-btn">×</button>
    </div>
</div>
```

```css
.task-card {}
.task-check {}
.check-box {} /* input */
.check-mark {} /* label */
.task-title {}
.task-opts > button {}
/*  */
.task-completed { 
    text-decoration: line-through; 
    text-decoration-color: rgba(0,0,0,0.45);
}
```