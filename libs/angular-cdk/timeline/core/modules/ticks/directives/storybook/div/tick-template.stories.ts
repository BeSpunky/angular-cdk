import { TickStoryDefinition } from '../tick-definitions.stories';

export function wrapStoryInDivTimeline(story: string)
{
    const timelineStyle            = `position: relative; height: 80vh; width: 98vw; overflow: hidden`;
    const currentPositionLineStyle = `width: 1px; height: 100%; position: absolute; left: 50%; right: 50%; top: 0; border-left: 1px solid purple;`

    return /*html*/`
    <div bsTimeline [zoom]="zoom" [date]="now" [positionY]="50" style="${timelineStyle}">
        <div style="${currentPositionLineStyle}"></div>
        ${story}
    </div>
    `;
}

export function createDivTickTemplate({ tickId, minZoom, maxZoom, labelKey, dayFactorKey, datesBetweenKey, color, width, offset }: TickStoryDefinition): string
{
    return /*html*/`
    <div *bsTimelineTick="${tickId}; minZoom: ${minZoom}; maxZoom: ${maxZoom}; label: label['${labelKey}']; dayFactor: dayFactors['${dayFactorKey}']; datesBetween: datesBetween['${datesBetweenKey}']; let tick;"
         [style.width.px]="tick.width"
         [style.height.px]="tick.width / 4"
         [style.transform]="'translate(' + tick.screenPositionX + 'px, ' + tick.screenPositionY + 'px)'"
         style="position: absolute; border-left: ${width}px solid ${color};"
    >
        <label [style.height.px]="tick.screenPositionY + ${offset}"
               style="position: absolute; left:5px; user-select: none">
            {{tick.label}}
        </label>
    </div>
    `;
}