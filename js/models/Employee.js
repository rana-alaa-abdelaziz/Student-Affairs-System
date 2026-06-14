export class Employee{
    constructor(id,name,email,jobTitle,office,phone){
        this.id=id;
        this.name=name;
        this.email=email;
        this.jobTitle=jobTitle;
        this.office=office;
        this.phone=phone
    }
    display(){
        return `course_id ${this.id},course_name ${this.name} email: ${this.this.email}, ${this.jobTitle}, ${this.office},${this.phone} `
    }
}

