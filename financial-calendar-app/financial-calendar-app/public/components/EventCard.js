import { DateFormatter } from '../utils/dateFormatter';
export class EventCard {
    constructor(event) {
        this.element = null;
        this.event = event;
    }
    render() {
        const card = document.createElement('div');
        card.className = `event-card impact-${this.event.impact.toLowerCase()}`;
        card.id = `event-${this.event.id}`;
        const header = document.createElement('div');
        header.className = 'event-header';
        const title = document.createElement('h3');
        title.textContent = this.event.title;
        const date = document.createElement('div');
        date.className = 'event-date';
        date.textContent = DateFormatter.formatDateTime(this.event.date);
        header.appendChild(title);
        header.appendChild(date);
        const description = document.createElement('p');
        description.className = 'event-description';
        description.textContent = this.event.description;
        const footer = document.createElement('div');
        footer.className = 'event-footer';
        const category = document.createElement('span');
        category.className = 'event-category';
        category.textContent = this.event.category;
        const impact = document.createElement('span');
        impact.className = `event-impact event-impact-${this.event.impact.toLowerCase()}`;
        impact.textContent = `Impact: ${this.event.impact}`;
        footer.appendChild(category);
        footer.appendChild(impact);
        const symbols = document.createElement('div');
        symbols.className = 'related-symbols';
        if (this.event.relatedSymbols && this.event.relatedSymbols.length > 0) {
            const symbolsLabel = document.createElement('span');
            symbolsLabel.textContent = 'Related: ';
            symbols.appendChild(symbolsLabel);
            this.event.relatedSymbols.forEach(symbol => {
                const symbolTag = document.createElement('span');
                symbolTag.className = 'symbol-tag';
                symbolTag.textContent = symbol;
                symbols.appendChild(symbolTag);
            });
        }
        card.appendChild(header);
        card.appendChild(description);
        card.appendChild(symbols);
        card.appendChild(footer);
        // Add click event
        card.addEventListener('click', () => this.handleCardClick());
        this.element = card;
        return card;
    }
    handleCardClick() {
        const event = new CustomEvent('event-selected', {
            detail: { event: this.event }
        });
        document.dispatchEvent(event);
    }
    update(event) {
        var _a;
        this.event = event;
        if (this.element) {
            const newElement = this.render();
            (_a = this.element.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(newElement, this.element);
            this.element = newElement;
        }
    }
}
//# sourceMappingURL=EventCard.js.map