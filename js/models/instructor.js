export class instructor{
    constructor(id,name,email,department,course,phone){
        this.id=id;
        this.name=name;
        this.email=email;
        this.department=department;
        this.course=course;
        this.phone=phone
    }
    display(){
        return `course_id ${this.id},course_name ${this.name} email: ${this.this.email}, ${this.department}, ${this.course},${this.phone} `
    }
}

