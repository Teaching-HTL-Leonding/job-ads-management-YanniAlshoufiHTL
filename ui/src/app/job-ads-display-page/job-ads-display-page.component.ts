import { Component, inject, OnInit, signal } from '@angular/core';
import { JobAd, JobService } from '../job.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-job-ads-display-page',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './job-ads-display-page.component.html',
    styleUrl: './job-ads-display-page.component.css',
})
export class JobAdsDisplayPageComponent implements OnInit {
    private readonly jobService = inject(JobService);
    protected readonly ads = signal<JobAd[] | undefined>(undefined);

    async ngOnInit() {
        this.ads.set(await this.jobService.getJobAds());
    }

    async onDelete(id: number) {
        await this.jobService.deleteJobAd(id);
        this.ads.set(await this.jobService.getJobAds());
    }
}
