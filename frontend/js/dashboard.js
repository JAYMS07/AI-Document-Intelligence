

const searchInput = document.getElementById("workspaceSearch");
const workspaceCards = document.querySelectorAll(".workspace-card");
const emptyMessage = document.getElementById("emptyMessage");
const toast = document.getElementById("toast");

// Search workspaces
searchInput.addEventListener("input", function () {
    const searchValue = this.value.toLowerCase().trim();
    let visibleCount = 0;

    workspaceCards.forEach((card) => {
        const workspaceName = card.dataset.name;
        const workspaceText = card.innerText.toLowerCase();

        const matches =
            workspaceName.includes(searchValue) ||
            workspaceText.includes(searchValue);

        card.style.display = matches ? "block" : "none";

        if (matches) {
            visibleCount++;
        }
    });

    emptyMessage.hidden = visibleCount !== 0;
});

// Open workspace notification
document.querySelectorAll(".open-workspace").forEach((button) => {
    button.addEventListener("click", function () {
        const workspace = this.dataset.workspace;

        window.location.href =
            "workspace.html?workspace=" +
            encodeURIComponent(workspace);
    });
});
