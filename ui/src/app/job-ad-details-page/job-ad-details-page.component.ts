import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobAd, JobService } from '../job.service';

@Component({
    selector: 'app-job-ad-details-page',
    standalone: true,
    imports: [RouterLink, FormsModule],
    templateUrl: './job-ad-details-page.component.html',
    styleUrl: './job-ad-details-page.component.css',
})
export class JobAdDetailsPageComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly jobService = inject(JobService);

    protected readonly jobAd = signal<JobAd | undefined>(undefined);
    protected readonly selectedLanguage = signal<string>('en');

    protected readonly currentTranslation = computed(() =>
        this.selectedLanguage() === 'en'
            ? this.jobAd()?.textEN
            : this.jobAd()?.translations?.find(t => t.language === this.selectedLanguage())
                  ?.translatedText,
    );

    async ngOnInit() {
        this.jobAd.set(await this.jobService.getJobAd(this.route.snapshot.params['id']));
    }
}
