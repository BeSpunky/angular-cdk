import { TickStoryDefinition } from '../tick-definitions.stories';

export function wrapStoryInSVGTimeline(story: string)
{
    return /*html*/`
    <svg bsTimeline [zoom]="zoom" [date]="now" [positionY]="50" height="85vh" width="100vw">
        <line x1="50%" y1="0"
              x2="50%" y2="100%"
              stroke="purple" stroke-width="1"
        ></line>
        ${story}
    </svg>
    `;
}

export function createSVGTickTemplate({ tickId, minZoom, maxZoom, labelKey, dayFactorKey, datesBetweenKey, color, width, offset }: TickStoryDefinition): string
{    
    return /*html*/`
    <g *bsTimelineTick="${tickId}; minZoom: ${minZoom}; maxZoom: ${maxZoom}; label: label['${labelKey}']; dayFactor: dayFactors['${dayFactorKey}']; datesBetween: datesBetween['${datesBetweenKey}']; let tick;">
        <line [attr.x1]="tick.screenPositionX" [attr.y1]="tick.screenPositionY + ${offset}"
              [attr.x2]="tick.screenPositionX" [attr.y2]="tick.screenPositionY + tick.sizeUnit"
              stroke-width="${width}" stroke="${color}"
        ></line>

        <text style="user-select: none" [attr.x]="tick.screenPositionX" [attr.y]="tick.screenPositionY" dx="4" dy="${offset}" font-size="20">{{tick.label}}</text>
    </g>
    `;
}