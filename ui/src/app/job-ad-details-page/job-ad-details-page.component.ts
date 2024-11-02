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
    protected readonly isEditingTitle = signal<boolean>(false);
    protected newTitle = '';

    protected readonly currentTranslation = computed(() =>
        this.selectedLanguage() === 'en'
            ? this.jobAd()?.textEN
            : this.jobAd()?.translations?.find(t => t.language === this.selectedLanguage())
                  ?.translatedText,
    );

    async ngOnInit() {
        this.jobAd.set(await this.jobService.getJobAd(this.route.snapshot.params['id']));
    }

    protected startEditingTitle() {
        this.newTitle = this.jobAd()?.title ?? '';
        this.isEditingTitle.set(true);
    }

    protected async saveTitle() {
        if (!this.jobAd()) return;

        await this.jobService.updateJobAd(this.jobAd()!.id, this.newTitle, this.jobAd()!.textEN);

        const updatedJob = await this.jobService.getJobAd(this.jobAd()!.id);
        this.jobAd.set(updatedJob);
        this.isEditingTitle.set(false);
    }
}
