let charactersList;

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
    charactersList = dq('#charactersList');

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

const makeCharacterElement = (data) => {
    let li = document.createElement('li');
    li.id = data._id;
    li.className = 'character';
    li.innerText = data.name;
    li.onclick = (e) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', '/characters/'+data._id);
        xhr.onload = (e) => {
            console.dir(e.target.response);
            li.className += 'active';
        }
        xhr.send();
        return;
    }
    charactersList.appendChild(li);
}

const handleList = (e) => {
    let p, c, last;
    if(e.keyCode === 8) return;
    else {
        p = (e.target) ? e.target.parentNode.parentNode : e;
        last = (p && p.children.length > 0) ? p.children[p.children.length-1] : null;
        if(last) console.log(last);
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
    return [];
}

const saveCharacter = () => {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/characters/'+name.value);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = (e) => { console.dir(e.target.response);};
    let reqBody = {
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
    xhr.send(JSON.stringify(reqBody));
    console.dir(reqBody);
    return;
}

const calculatePer = () => {
    let offset = statPer.value - 10;
    statPer.value = statIQ.value + offset;
}

const calculateWill = () => {
    let offset = statWill.value - 10;
    statWill.value = statIQ.value + offset;
}

const calculateBasicLift = () => {
    statLift.innerText = Math.floor((statST.value * statST.value) / 5);
    return statLift.innerText;
}

const calculateBasicMove = () => {
    statMove.innerText = Math.floor((statHT.value + statDX.value) / 4);
    return statMove.innerText;
}

const calculateBasicSpeed = () => {
    statSpeed.innerText = (statHT.value + statDX.value) / 4;
    calculateBasicMove();
    return statSpeed.innerText;
}

// Get all characters currently in the database
const getCharacters = (e) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/characters');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = (e) => { console.dir(e.target.response);};
    xhr.send();
    return;
}

window.onload = () => {
    grabDocElements();

    document.querySelector('#saveCharacter').onclick = saveCharacter;

    handleList(advantages, 'advantage');
    handleList(disadvantages, 'disadvantage');
    handleList(skills, 'skill');

    advantages.onkeyup = handleList;
    disadvantages.onkeyup = handleList;
    skills.onkeyup = handleList;

    statST.onkeyup = () => calculateBasicLift;
    statDX.onkeyup = () => calculateBasicSpeed;
    statIQ.onkeyup = () => { calculatePer(); calculateWill(); }
    statHT.onkeyup = () => calculateBasicSpeed;
}