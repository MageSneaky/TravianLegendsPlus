ShowTotalResourcesNeeded();

function ShowTotalResourcesNeeded() {
    let trainTroopsDiv = document.querySelector('div.buildActionOverview.trainUnits');

    if (!trainTroopsDiv) {
        return;
    }

    let wantedQuantityInputs = [];
    let maxPossibleAmountButtons = [];

    trainTroopsDiv.querySelectorAll('div.cta > a[onclick^="jQuery"]').forEach(button => {
        maxPossibleAmountButtons.push(button);
    });
    trainTroopsDiv.querySelectorAll('input[type="text"]').forEach(input => {
        wantedQuantityInputs.push(input);
    });

    maxPossibleAmountButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            this.parentNode.querySelector('input').dispatchEvent(new Event('input')); // forces the input event to fire on `wantedQuantityInput`
        });
    });

    wantedQuantityInputs.forEach(input => {
        input.addEventListener('input', function (event) {
            let amount = Number(this.value);
            let parent = this.parentNode.parentNode;
            let neededResourcesList = parent.querySelector('div.inlineIconList.resourceWrapper'); // div that contains the resource list
            let totalResourcesNeededList = parent.querySelector('div.inlineIconList.resourceWrapper#totalResourcesNeeded');
            // checks if the total resources needed list already exists
            if (!totalResourcesNeededList) {
                // if error message is displayed, expands troop info to fit the new `totalResourcesNeededList`
                if (parent.querySelector('div.errorMessage')) {
                    parent.closest('div.action.troop:not(.empty)').style.height = "200px";
                }
                let clone = neededResourcesList.cloneNode(true);
                clone.id = "totalResourcesNeeded";
                parent.appendChild(clone);
                totalResourcesNeededList = clone;
            }
            let neededResources = neededResourcesList.querySelectorAll('div > span');
            let totalNeededResources = totalResourcesNeededList.querySelectorAll('div > span');
            neededResources.forEach(function (resource, i) {
                totalNeededResources[i].innerText = Number(resource.innerText) * amount;
            });
        });
    });
}