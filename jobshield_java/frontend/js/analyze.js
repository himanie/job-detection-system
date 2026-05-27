// Parse URL and extract job details
async function parseUrl(event){
    
    if(event){
        event.preventDefault();
    }

    const url=document.getElementById("jobUrl").value;

    if(!url){
        alert("Please enter a Job URL");
        return;
    }

    // show loading spinner
    document.getElementById("loadingSpinner").style.display="block";

    try{

        const response=await fetch("http://127.0.0.1:5000/analyze",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                url:url
            })

        });

        const data=await response.json();

        document.getElementById("loadingSpinner").style.display="none";

        if(data.error){
            alert(data.error);
            return;
        }

        // hide placeholder
        document.getElementById("resultsPlaceholder").style.display="none";

        // show results
        document.getElementById("resultsContainer").style.display="block";

        // update values
        document.getElementById("trustScore").innerText="100";

        document.getElementById("riskLevel").innerText=data.risk;

        document.getElementById("redFlagsList").innerHTML=
        "<li>No suspicious keywords detected</li>";

        document.getElementById("indicatorsList").innerHTML=
        "<li>Valid job posting source</li>";

    }

    catch(error){

        document.getElementById("loadingSpinner").style.display="none";

        console.log(error);
        alert("Server error");

    }

}