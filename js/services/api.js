const url='http://localhost:3000';
const request=async(endpoint,method="Get",data=null)=>{
    const config={
        method ,
        headers:{
            "Content-Type": "application/json"
        },
        ...(data && {body:JSON.stringify(data)})
    };
    try{
        const respond= await fetch(`${url}/${endpoint}`, config);
        if(!respond.ok) throw new Error("HTTP error");
        return await respond.json();
    }catch(error){
        console.error(error);
        return null;
    };
}
export const api={
get:endpoint=>request(endpoint,"GET"),
post:(endpoint,data)=>request(endpoint,"POST",data),
put:(endpoint, data)=>request(endpoint,"PUT",data),
patch:(endpoint,data)=>request(endpoint,"PATCH",data),
delete:endpoint=>request(endpoint,"DELETE")
}