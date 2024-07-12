import axios from "axios";

export default function Record(subject, subjectmatter, topic, difficulty, question, totalscore, score) {

    // Transformamos el JSON obtenido de objeto a string.
    const JSONMysql = JSON.stringify(question);

    // Buscamos la informacion actual del usuario. 
    if (subject !== null && subjectmatter !== null && topic !== null && difficulty !== null && question !== null && totalscore != null && score!= null) {
        axios.post('http://localhost:3001/recordexercises', { subject: subject, subjectmatter: subjectmatter, topics: topic, difficulty: difficulty, question: JSONMysql, score: score, totalscore: totalscore})
                .then(res => {
                    if(res.data.Status === "Success") {
                        // AQUI PODEMOS MANDAR UN RETURN PARA AVISAR AL USUARIO QUE SU INFORMACION A SIDO MODIFICADA
                        console.log("Se ha guardado toda la informacion correctamente");
                    } 
                    else {
                        console.log(res.data.Error);
                    }
    });

    return 

}}