const main_page_template = /*HTML*/`
    <div class="row" id="places-buttons">
        <div class="col d-flex align-items-end flex-column gap-1">
            <div class="row">
                <h2>Indoor</h2>
            </div>
            {{#each places.indoor}}
                <button class="btn btn-primary text-capitalize">{{@key}}</button>
            {{/each}}
            <button class="btn btn-outline-primary">Add place</button>
        </div>
        <div class="col d-flex align-items-start flex-column border-start gap-1">
            <div class="row">
                <h2>Outdoor</h2>
            </div>
            {{#each places.indoor}}
                <button class="btn btn-primary">In front of {{@key}}</button>
            {{/each}}
            {{#each places.outdoor}}
                <button class="btn btn-primary text-capitalize">{{@key}}</button>
            {{/each}}
            <button class="btn btn-outline-primary">Add place</button>
        </div>
    </div>
    `;