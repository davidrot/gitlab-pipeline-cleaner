# gitlab-pipeline-cleaner

I was trying to setup a new repository with a CI in my GitLab environment. During the configuration, I was creating a lot of failed jobs and pipelines. I was looking for a solution to delete and remove the failed pipelines from my history. This was only possible for single jobs. This was not a satisfying solution for me. Therefore I've created a small javascript snippet.

Usage: 

Go to your pipelines view for example `gitlab.com/user/project/-/pipelines` and execute the javascript.

Minified version: 
```javascript
javascript:let token;function checkToken(){const e="PIPELINEDELETIONTOKEN";if((token=localStorage.getItem(e))||(token=window.prompt("Please input gitlab token for pipeline deletion.",""),localStorage.setItem(e,token)),!token)throw"Missing token to delete pipelines"}function send(e,t,n){var o=new XMLHttpRequest;o.onreadystatechange=function(){4==o.readyState&&200==o.status&&n&&n(o.responseText)},o.open(e,t),o.setRequestHeader("PRIVATE-TOKEN",token),o.send()}var getCurrentProjectId=()=>document.body.getAttribute("data-project-id");function getShownPipelineIds(){return Array.prototype.slice.call(document.querySelectorAll(".pipeline-id")).map(e=>e.innerText.match(/(\d*)$/)).filter(e=>e.length>1).map(e=>e[1])}function deleteShownPipelines(){checkToken();var e=getCurrentProjectId();getShownPipelineIds().forEach(t=>deletePipeline(e,t)),location.reload()}deletePipeline=((e,t)=>send("DELETE",`${location.origin}/api/v4/projects/${e}/pipelines/${t}`)),deleteShownPipelines();
```

Sadly this code requires personal access tokens. I was hoping it was working with the already stored session information in the cookies. You can find all information [here](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html). The snippet will ask for the token and will store it in the local storage. 

Code:
```javascript
let token;
function checkToken() {
    const KEY = "PIPELINEDELETIONTOKEN"
    token = localStorage.getItem(KEY);
    if (!token) {
        token = window.prompt("Please input gitlab token for pipeline deletion.", "");
        localStorage.setItem(KEY, token);
    }

    if (!token) {
        throw "Missing token to delete pipelines";
    }
}

function send(verb, url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState == 4 && xhr.status == 200 && callback)
        {
            callback(xhr.responseText);
        }
    };
    xhr.open(verb, url);
    xhr.setRequestHeader('PRIVATE-TOKEN', token)
    xhr.send();
}

const getCurrentProjectId = () => document.body.getAttribute('data-project-id');

function getShownPipelineIds() {
    return Array.prototype.slice.call(document.querySelectorAll(".pipeline-id"))
        .map(x => x.innerText.match(/(\d*)$/))
        .filter(x => x.length > 1)
        .map(x => x[1])
}

const deletePipeline = (projectId, pipelineId) => send('DELETE', `${location.origin}/api/v4/projects/${projectId}/pipelines/${pipelineId}`);
function deleteShownPipelines() {
    checkToken();
    const projectId = getCurrentProjectId();
    getShownPipelineIds().forEach(id => deletePipeline(projectId, id));
    location.reload()
}
deleteShownPipelines();
```
