export class course{
    constructor(id,name,instructor){
        this.id=id;
        this.name=name;
        this.instructor=instructor;
    }
    display(){
        return `course_id ${this.id},course_name ${this.name} instructor: ${this.instructor}, `
    }
}