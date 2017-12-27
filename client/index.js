let tabEdit, tabList;
let charactersList;
let characterEdit;

let _id; // character's unique identifier
// Character attribute elements
let name;
let player;
let height
let weight;
let sizeModifier;
let age;
let appearance;
let statST, statDX, statIQ, statHT;
let statHP, statPer, statWill, statFP;
let statLift, statSpeed, statMove, statDmg;
let advantages, disadvantages, skills;
let inventory, meleeWeapons, rangedWeapons, armor, possessions;

const dq = (element) => { return document.querySelector(element); }

const grabDocElements = () => {
    tabEdit = dq('#edit');
    tabList = dq('#list');

    listContainer = dq('#list-container');
    editContainer = dq('#edit-container');

    characterList = dq('#character-list');

    _id = dq('#_id');
    name = dq('#charName');
    player = dq('#charPlayer');
    height = dq('#charHeight');
    weight = dq('#charWeight');
    sizeModifier = dq('#charSizeModifier');
    age = dq('#charAge');
    appearance = dq('#charAppearance');
    statST = dq('#statST');
    statDX = dq('#statDX');
    statIQ = dq('#statIQ');
    statHT = dq('#statHT');
    statFP = dq('#statFP');
    statHP = dq('#statHP');
    statPer = dq('#statPer');
    statWill = dq('#statWill');
    statFP = dq('#statFP');
    statLift = dq('#statLift');
    statSpeed = dq('#statSpeed');
    statMove = dq('#statMove');
    statDmg = dq('#statDmg');
    advantages = dq('#advantages');
    disadvantages = dq('#disadvantages');
    skills = dq('#skills');
    inventory = dq('#inventory');
    meleeWeapons = dq('#meleeWeapons');
    rangedWeapons = dq('#rangedWeapons');
    armor = dq('#armor');
    possessions = dq('#possessions');
}

const deleteEmptyElement = (e) => {
    if( e.keyCode !== 8) return; // If not delete key, return
    if( e.target.value.length <= 0 && e.target.parentNode.parentNode.children.length >= 2){
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    }
}

const makeListElement = () => {
    let span = document.createElement('span');
    let input0 = document.createElement('input');
    let input1 = document.createElement('input');
    input0.className = 'alias';
    input1.className = 'pointsValue';
    span.appendChild(input0);
    span.appendChild(input1);
    span.onkeyup = deleteEmptyElement;
    return span;
}

const handleList = (e) => {
    let p, c, last;
    if(e.keyCode === 8) return;
    else {
        p = (e.target) ? e.target.parentNode.parentNode : e;
        last = (p && p.children.length > 0) ? p.children[p.children.length-1] : null;
        if(p && !last){
            c = makeListElement();
            p.appendChild(c);
        }
        else if(last.children[0].value.length > 0){
            c = makeListElement();
            p.appendChild(c);
        }
    }
}

const getChildrenValues = (parent) => {
    let result = [];
    for(let i=0; i<parent.children.length; i++){
        let child = parent.children[i];
        let name = child.children[0].value;
        let points = parseInt(child.children[1].value.replace(' ',''));
        if(name && points) result.push({name: name, points: points});
    }
    return result;
}

getCharacterFromPage = (overwrite) => {
    return {
        overwrite: overwrite,
        name: name.value,
        player: player.value,
        description: {
            height: height.value,
            weight: weight.value,
            sizeModifier: sizeModifier.value,
            age: age.value,
            appearance: appearance.value
        },
        stats: {
            ST  : statST.value,
            DX  : statDX.value,
            IQ  : statIQ.value,
            HT  : statHT.value,
            HP  : statHP.value,
            Will: statWill.value,
            Per : statPer.value,
            FP  : statFP.value
        },
        advantages   : getChildrenValues(advantages),
        disadvantages: getChildrenValues(disadvantages),
        skills       : getChildrenValues(skills),
        inventory: {
            meleeWeapons : getChildrenValues(meleeWeapons),
            rangedWeapons: getChildrenValues(rangedWeapons),
            armor        : getChildrenValues(armor),
            possessions  : getChildrenValues(possessions)
        }
    };
}

const overwriteCharacter = () => {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/characters/'+_id.innerText);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = (e) => {
        console.log(e.target.response);
        getCharacters(displayCharacters);
    };
    xhr.send(JSON.stringify(getCharacterFromPage(true)));
    return;
}

const saveNewCharacter = () => {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/characters/thisiddont');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = (e) => { 
        console.log(e.target.response);
        getCharacters(displayCharacters);
        showListPage();
    };
    xhr.send(JSON.stringify(getCharacterFromPage()));
    return;
}

// Loads the given JSON information into the edit page's values
const loadCharacter = (char) => {
    console.log(char);
    // Basic information
    _id.innerText = char._id;
    name.value = char['name'];
    player.value = char.player;
    height.value = char.description.height;
    weight.value = char.description.weight;
    sizeModifier.value = char.description.sizeModifier;
    age.value = char.description.age;
    appearance.value = char.description.appearance;
    // Stats
    statST.value = char.stats.ST;
    statDX.value = char.stats.DX;
    statIQ.value = char.stats.IQ;
    statHT.value = char.stats.HT;
    statHP.value = char.stats.HP;
    statPer.value = char.stats.Per;
    statWill.value = char.stats.Will;
    statFP.value = char.stats.FP;
    // Ads, Disads, Skills
    for(let i=0; i<char.advantages.length; i++){
        advantages.children[advantages.children.length-2].value = char.advantages[i];
        handleList(advantages);
    }
}

const calculateBasicLift = () => {
    let ST = parseInt(statST.value) || 10;
    statLift.innerText = Math.floor((ST*ST) / 5);
    return statLift.innerText;
}

const calculateBasicMove = () => {
    let DX = parseInt(statDX.value) || 10;
    let HT = parseInt(statHT.value) || 10;
    statMove.innerText = Math.floor((DX+HT) / 4);
    return statMove.innerText;
}

const calculateBasicSpeed = () => {
    let DX = parseInt(statDX.value) || 10;
    let HT = parseInt(statHT.value) || 10;
    statSpeed.innerText = (DX+HT) / 4;
    calculateBasicMove();
    return statSpeed.innerText;
}

// Get all characters currently in the database
const getCharacters = (cb) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/characters');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = (res) => {cb(res)};
    xhr.send();
}

const displayCharacters = (res) => {
    let data = JSON.parse(res.currentTarget.response);
    while(characterList.lastChild) 
        characterList.removeChild(characterList.lastChild);
    if(data.length <= 0){
        let li = document.createElement('li');
        li.innerText = 'No characters found.';
        characterList.append(li);
    }
    // Loop through the retrieved characters
    for(let i=0; i<data.length; i++){
        let li = document.createElement('li');
        li.className = (i%2 === 0) ? 'character alt0' : 'character alt1';
        let span = document.createElement('span');
        span.id = data[i]._id;
        span.innerText = data[i].name || 'no name';
        span.onclick = (e) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', '/characters/'+data[i]._id);
            xhr.onload = (e) => {
                console.dir(e.target.response);
                loadCharacter(JSON.parse(e.target.response)[0]);
                showEditPage();
            };
            xhr.send();
            return;
        };
        // Make the delete button
        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'delete';
        deleteButton.onclick = (e) => {
            let xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/characters/'+data[i]._id);
            xhr.onload = (e) => {
                console.dir(e.target.response);
                getCharacters(displayCharacters);
            };
            xhr.send();
            return;
        };
        li.appendChild(span);
        li.appendChild(deleteButton);
        characterList.appendChild(li);
    }
}

const showEditPage = () => {
    editContainer.style.display = 'block';
    listContainer.style.display = 'none';

    tabEdit.className += 'active';
    tabList.className = '';
}

const showListPage = () => {
    listContainer.style.display = 'block';
    editContainer.style.display = 'none';

    tabList.className += 'active';
    tabEdit.className = '';
}

window.onload = () => {
    grabDocElements();

    tabList.onclick = showListPage;
    tabEdit.onclick = showEditPage;

    document.querySelector('#updateCharacter').onclick = overwriteCharacter;
    document.querySelector('#saveNewCharacter').onclick = saveNewCharacter;

    handleList(advantages, 'advantage');
    handleList(disadvantages, 'disadvantage');
    handleList(skills, 'skill');
    handleList(meleeWeapons, 'melee');
    handleList(rangedWeapons, 'ranged');
    handleList(armor, 'armor-piece');
    handleList(possessions, 'item');

    advantages.onkeydown = handleList;
    disadvantages.onkeydown = handleList;
    skills.onkeydown = handleList;

    statST.onkeyup = () => calculateBasicLift;
    statDX.onkeyup = () => {
        calculateBasicSpeed();
        calculateBasicMove();
    }
    statHT.onkeyup = () => {
        calculateBasicSpeed();
        calculateBasicMove();
    }

    getCharacters(displayCharacters);
}

window.onkeydown = (e) => {
    switch(e.keyCode){
        case 32: // space
        break;
        default:
        break;
    }
}