import { Routes } from '@angular/router';
import { JobAdsDisplayPageComponent } from './job-ads-display-page/job-ads-display-page.component';
import { JobAdDetailsPageComponent } from './job-ad-details-page/job-ad-details-page.component';
import { JobAdUpdatePageComponent } from './job-ad-update-page/job-ad-update-page.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: JobAdsDisplayPageComponent,
    },
    {
        path: 'job/:id',
        component: JobAdDetailsPageComponent,
    },
    {
        path: 'job/:id/edit',
        component: JobAdUpdatePageComponent,
    },
];
