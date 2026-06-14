export class Student{
    constructor(id,name,phone,course,instructorName){
        this.id=id;
        this.name=name;
        this.phone=phone;
        this.course=course;
        this.instructorName=instructorName;
    }
    display(){
        return `${this.name},phone:${this.phone},course name:${this.course}`
    }
}