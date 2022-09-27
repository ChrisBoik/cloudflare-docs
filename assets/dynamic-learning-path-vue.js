import { learning_paths as paths } from "json-collector";


let current_path;
const regex = '\/$'

for (const item in paths) {
    let amended_path = location.pathname
    if (!location.pathname.match(regex)) {
        amended_path += '/'
    }
    if (paths[item].path === amended_path) {
        current_path = paths[item];
    }
}

let filteredElements = current_path.elements.filter(element => { return element.visible_by_default !== false})

Vue.createApp({
    methods: {
        onRadioButtonChange() {
            const selectedOptions = document.querySelectorAll('input[type=radio]:checked');
            this.elements = current_path.elements.filter (element => {
                let keepItem = true;
                if (element.variables !== undefined) {
                    for (const i in element.variables) {
                        let variableActive = false;
                        selectedOptions.forEach((item) => {
                            if(item.name === element.variables[i].name) {
                                variableActive = true;
                               if (item.value !== element.variables[i].value.toString()) {
                                keepItem = false;
                               }
                            }
                        })
                        if (!variableActive) {
                           return false; 
                        } 
                    }
                    return keepItem;
                } else {
                    return keepItem;
                }
                })
            }
        },
    template: `
    <div class="background">
    <div v-for="element in elements" v-on:change="onRadioButtonChange">
        <div class="learningPathModule" v-if="element.type === 'module'">
        <div class="moduleHeader">
            <h2 :id="element.title.toLowerCase().replaceAll(' ', '-')"><span class="DocsMarkdown--header-anchor-positioner">
                <a
                class="DocsMarkdown--header-anchor Link Link-without-underline"
                :href="'#' + element.title.toLowerCase().replaceAll(' ', '-')"
                >&#8203;​</a
                >
            </span>
            <span>[[ element.title ]]</span>
            </h2>
            <p v-if="element.estimated_time" class="durationEstimate">[[ element.estimated_time ]]</p>
        </div>
        <div v-if="element.description" v-html="element.description"></div>
        <details>
            <summary>Contains [[ element.pages.length ]] units</summary>
            <div>
                <ul>
                    <li v-for="page in element.pages"><a :href="page.url_path" target="_blank">[[ page.link_title ]]</a>
                    <div v-if="page.additional_description" class="learningPathNote" v-html="page.additional_description"></div>
                    </li>
                </ul>
            </div>
        </details>
        </div>
        <div v-else-if="element.type === 'question'">
        <hr class="questionBreak">
        <div class="question" :id="element.id">
            <fieldset :id="element.id">
            <legend v-html="element.description"></legend>
                <div v-for="choice in element.choices">
                    <input type="radio" :name="element.id" :id="choice.value" 
                    :value=choice.value @change="onRadioButtonChange()">
                    <label :for="choice.name">[[ choice.name ]]</label>
                </div>
            </fieldset>
        </div>
        <hr class="questionBreak">
        </div>
    </div>
    </div>`,
    data() {return {
        elements: filteredElements
    }},
    delimiters: ['[[', ']]'],
  }).mount('#dynamicPath');