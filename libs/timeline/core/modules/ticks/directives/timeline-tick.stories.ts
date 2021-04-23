import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TimelineCdkModule } from '@bespunky/angular-cdk/timeline';
import { Meta, moduleMetadata, componentWrapperDecorator, Story } from '@storybook/angular';

export default {
    title: 'Timeline Tick',
    decorators: [
        moduleMetadata({
            imports: [TimelineCdkModule, CommonModule],
        }),
        componentWrapperDecorator(story => `<svg bsTimeline>${story}</svg>`)
    ]
} as Meta;

export const Template: Story<any> = (args) => ({
    props   : args,
    template: `
        <line *bsTimelineTick="'year'; minZoom: -100; maxZoom: 160; label: label.years; dayFactor: dayFactors.daysInYear; datesBetween: datesBetween.years; let screenPositionX = screenPositionX; let screenPositionY = screenPositionY; let label = label"
              [attr.x1]="screenPositionX | async" [attr.y1]="screenPositionY | async"
              [attr.x2]="screenPositionX | async" [attr.y2]="(screenPositionY | async)! + 500"
              stroke-width="5" stroke="black"
        ></line>
    `
});
