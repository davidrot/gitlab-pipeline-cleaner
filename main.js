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