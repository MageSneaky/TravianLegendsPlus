ShowTotalResourcesNeeded();
SortAllianceMembers();

function SortAllianceMembers() {
    let sortedBy = 'counter';

    let allianceMembers = [];

    document.querySelectorAll('table.allianceMembers tbody tr').forEach(element => {
        let newMember = {};
        newMember.element = element.innerHTML;
        newMember.nr = Number(element.children[0].innerText.substring(0, element.children[0].innerText.length - 1));
        newMember.tribe = element.children[1].children[0].classList[0];
        newMember.name = element.children[2].innerText;
        newMember.population = Number(element.children[3].innerText);
        newMember.villages = Number(element.children[4].innerText);
        allianceMembers.push(newMember);
    });

    document.querySelectorAll('table.allianceMembers thead tr > td:not(.buttons)').forEach(element => {
        element.style.cursor = "pointer";
        element.addEventListener('click', (event) => {
            if (sortedBy == element.classList[0]) {
                allianceMembers.reverse();
                SortMembers();
                return
            }
            switch (element.classList[0]) {
                case "counter":
                    allianceMembers.sort((a, b) => {
                        return a.nr - b.nr;
                    });
                    sortedBy = 'counter';
                    break;
                case "tribe":
                    allianceMembers.sort((a, b) => {
                        const tribeA = a.tribe.toLowerCase();
                        const tribeB = b.tribe.toLowerCase();
                        if (tribeA < tribeB) {
                            return -1;
                        }
                        if (tribeA > tribeB) {
                            return 1;
                        }
                        return 0;
                    });
                    sortedBy = 'tribe';
                    break;
                case "player":
                    allianceMembers.sort((a, b) => {
                        const nameA = a.name.toLowerCase();
                        const nameB = b.name.toLowerCase();
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                        return 0;
                    });
                    sortedBy = 'player';
                    break;
                case "population":
                    allianceMembers.sort((a, b) => {
                        return a.population - b.population;
                    });
                    allianceMembers.reverse();
                    sortedBy = 'population';
                    break;
                case "villages":
                    allianceMembers.sort((a, b) => {
                        return a.villages - b.villages;
                    });
                    allianceMembers.reverse();
                    sortedBy = 'villages';
                    break;
            }
            SortMembers();
        });
    });

    function SortMembers() {
        document.querySelector('table.allianceMembers tbody').innerHTML = '';
        allianceMembers.forEach(member => {
            let newRow = document.createElement('tr');
            newRow.innerHTML = member.element;
            document.querySelector('table.allianceMembers tbody').appendChild(newRow);
        });
    }
}

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
        button.addEventListener('click', (event) => {
            event.target.parentNode.querySelector('input').dispatchEvent(new Event('input')); // forces the input event to fire on `wantedQuantityInput`
        });
    });

    wantedQuantityInputs.forEach(input => {
        input.addEventListener('input', (event) => {
            let amount = Number(event.target.value);
            let parent = event.target.parentNode.parentNode;
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
            neededResources.forEach((resource, i) => {
                totalNeededResources[i].innerText = Number(resource.innerText) * amount;
            });
        });
    });
}