
const workspaceSelect = document.getElementById("workspaceSelect");
const workspaceTitle = document.getElementById("workspaceTitle");
const workspaceDescription = document.getElementById("workspaceDescription");
const breadcrumbName = document.getElementById("breadcrumbName");
const workspaceIcon = document.getElementById("workspaceIcon");

const documentUpload = document.getElementById("documentUpload");
const documentList = document.getElementById("documentList");
const documentCount = document.getElementById("documentCount");
const documentSearch = document.getElementById("documentSearch");

const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

const toast = document.getElementById("toast");

// Workspace information
const workspaceData = {
    "HR": {
        title: "HR Workspace",
        description: "Manage HR documents and find company policies using AI.",
        icon: "♙"
    },
    "Technical Documentation": {
        title: "Technical Documentation",
        description: "Explore technical manuals, API documentation and development guides.",
        icon: "⌘"
    },
    "Finance": {
        title: "Finance Workspace",
        description: "Manage financial reports, budgets and company expenses.",
        icon: "₹"
    },
    "General Company": {
        title: "General Company",
        description: "Explore shared company documents and organizational knowledge.",
        icon: "▤"
    }
};

// Store selected files separately for each workspace during this browser session.
const workspaceFiles = {
    "HR": [],
    "Technical Documentation": [],
    "Finance": [],
    "General Company": []
};

const params = new URLSearchParams(window.location.search);

const requestedWorkspace = params.get("workspace");

let currentWorkspace = Object.hasOwn(
    workspaceData,
    requestedWorkspace
) ? requestedWorkspace : "HR";

workspaceSelect.value = currentWorkspace;


function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Change workspace
function changeWorkspace() {
    currentWorkspace = workspaceSelect.value;

    const data = workspaceData[currentWorkspace];

    workspaceTitle.textContent = data.title;
    workspaceDescription.textContent = data.description;
    breadcrumbName.textContent = data.title;
    workspaceIcon.textContent = data.icon;

    chatMessages.innerHTML = `
        <div class="ai-message">
            <div class="message-avatar">✦</div>
            <div class="message-content">
                <strong>KnowBase AI</strong>
                <p>
                    Welcome to ${data.title}.
                    Upload documents to prepare your knowledge base.
                </p>
            </div>
        </div>
    `;

    documentSearch.value = "";
    changeWorkspace();
}

workspaceSelect.addEventListener("change", changeWorkspace);

// Display documents
function renderDocuments() {
    const files = workspaceFiles[currentWorkspace];
    const search = documentSearch.value.toLowerCase().trim();

    const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(search)
    );

    documentCount.textContent = files.length;

    if (filteredFiles.length === 0) {
        documentList.innerHTML = `
            <div class="empty-state">
                <div>▤</div>
                <h3>${files.length === 0 ? "No documents yet" : "No matching documents"}</h3>
                <p>
                    ${files.length === 0
                        ? "Upload documents to start building your knowledge base."
                        : "Try another document name."}
                </p>
            </div>
        `;
        return;
    }

    documentList.innerHTML = filteredFiles.map(file => `
        <div class="document-item">
            <div class="file-icon">${file.extension}</div>
            <div class="file-details">
                <h4>${escapeHTML(file.name)}</h4>
                <p>${file.size} · ${file.date}</p>
            </div>
        </div>
    `).join("");
}

// Escape filenames before displaying them in HTML.
function escapeHTML(value) {
    return value.replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Upload document previews
documentUpload.addEventListener("change", function () {
    const selectedFiles = Array.from(this.files);
    let addedCount = 0;

    selectedFiles.forEach(file => {
        const extension = file.name.split(".").pop().toLowerCase();

        if (!["pdf", "docx", "txt"].includes(extension)) {
            showToast("Unsupported file: " + file.name);
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            showToast(file.name + " exceeds the 10 MB demo limit.");
            return;
        }

        const alreadyExists = workspaceFiles[currentWorkspace]
            .some(existing => existing.name === file.name);

        if (alreadyExists) {
            showToast(file.name + " is already listed.");
            return;
        }

        workspaceFiles[currentWorkspace].push({
            name: file.name,
            size: formatFileSize(file.size),
            extension: extension.toUpperCase(),
            date: new Date().toLocaleDateString()
        });

        addedCount++;
    });

    renderDocuments();

    if (addedCount > 0) {
        showToast(addedCount + " document(s) added to the demo list.");
    }

    this.value = "";
});

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

documentSearch.addEventListener("input", renderDocuments);

// Demo chat
function addMessage(message, type) {
    const wrapper = document.createElement("div");
    wrapper.className = type === "user" ? "user-message" : "ai-message";

    const content = document.createElement("div");
    content.className = "message-content";

    const heading = document.createElement("strong");
    heading.textContent = type === "user" ? "You" : "KnowBase AI";

    const paragraph = document.createElement("p");
    paragraph.textContent = message;

    content.appendChild(heading);
    content.appendChild(paragraph);

    if (type === "ai") {
        const avatar = document.createElement("div");
        avatar.className = "message-avatar";
        avatar.textContent = "✦";
        wrapper.appendChild(avatar);
    }

    wrapper.appendChild(content);
    chatMessages.appendChild(wrapper);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const question = chatInput.value.trim();

    if (!question) return;

    addMessage(question, "user");

    addMessage(
        "This is currently a frontend demo. Once the backend and RAG system are connected, I will search documents in the " +
        currentWorkspace + " workspace and provide an answer with source references.",
        "ai"
    );

    chatInput.value = "";
});

// Suggested questions
document.querySelectorAll(".suggestion").forEach(button => {
    button.addEventListener("click", () => {
        chatInput.value = button.textContent;
        chatInput.focus();
    });
});

// Initial rendering
renderDocuments();
