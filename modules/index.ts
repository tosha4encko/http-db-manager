module.exports = {
    getTodoList: function(callback:any){
        db.all("SELECT * FROM todo", function(err:any, res:any){
            callback(res);
        });
    },
    addTask: function(taskName:string, callback:any){
        // Add a task to the todo list.
        db.run("INSERT INTO todo VALUES ($task)", {
            $task: taskName
        }, function(){
            callback();
        });
    },
    completeTask: function(taskName:string, callback:any){
        // Delete the task from the todo list.
        db.run("DELETE FROM todo WHERE task=$task", {
            $task: taskName
        }, function(){
            db.run("INSERT INTO done VALUES ($task)", {
                $task: taskName
            }, function(){
                callback();
            });
        });
    },
    clearComplete: function(callback:any){
        // Delete all cleared tasks.
        db.run("DELETE FROM done", function(){
            callback();
        });
    }
};