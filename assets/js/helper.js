async function fetchPrs(repoalias){
    var resp = await fetch(`https://api.github.com/repos/${repoalias}/pulls?state=all`)
    var prs = await resp.json();
    return {
        pr: prs.length,
        prMerged: prs.filter((pr)=>pr.state==="closed" && pr.merged_at !== null).length,
        prOpen: prs.filter((pr)=>pr.state === "open").length,
    };
}
async function fetchIssues(repoalias){
    var resp = await fetch(`https://api.github.com/repos/${repoalias}/issues?state=all`)
    var issues = await resp.json();
    return {
        issues: issues.length,
        issuesClosed: issues.filter((issue)=>issue.state === "closed").length,
    };
}

async function createRepoDOM(item){
    let div = document.createElement('div');
    let a = document.createElement('a');
    let p = document.createElement('p');
    a.href = item.link;
    a.innerText = item.name;
    p.innerHTML = item.description;
    div.setAttribute("class", "col-12 col-md-4 aos-init aos-animate p-2 border");
    div.setAttribute("data-aos", "fade-up");
    div.appendChild(a);
    div.appendChild(p);
    let labeldiv=document.createElement('div');
    let badges="";
    if(item.techstack)
    item.techstack.map(tech => {
        badges+=`<span class="badge text-muted">${tech}</span>`;
    })
    labeldiv.innerHTML=badges;
    div.appendChild(labeldiv);
    const {pr, prMerged, prOpen} = await fetchPrs(item.repoalias);
    const {issues, issuesClosed} = await fetchIssues(item.repoalias);
    let prdiv = document.createElement('div');
    prdiv.innerHTML= `<div><p class="fs-4">Pull Requests</p><p class="badge bg-primary m-1">Total: ${pr} </p><p class="badge bg-primary m-1">  Merged: ${prMerged}</p> <p class="badge bg-primary m-1">Open: ${prOpen}</p></div>`;
    prdiv.setAttribute("class","m-2");
    let issuediv =document.createElement('div');
    issuediv.innerHTML= `<div><p class="fs-4">Issues</p><p class="badge bg-primary m-1">Total: ${issues} </p><p class="badge bg-primary m-1">  Closed: ${issuesClosed}</p></div>`;
    issuediv.setAttribute("class","m-2");
    div.appendChild(prdiv);
    div.appendChild(issuediv);
    a.setAttribute("class", "p-2 lift mr-1");
    p.setAttribute("class", "text-muted mb-0 p-2");
    return div;
}