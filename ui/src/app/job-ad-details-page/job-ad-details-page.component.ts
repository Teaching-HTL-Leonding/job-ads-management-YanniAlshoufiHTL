import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobAd, JobService } from '../job.service';
import { firstValueFrom } from 'rxjs';

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
    protected readonly isAddingTranslation = signal<boolean>(false);
    protected readonly isDeletingTranslation = signal<boolean>(false);
    protected newTitle = '';
    protected newTranslationLanguage = '';
    protected newTranslationText = '';
    protected translationToDelete = '';

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

    protected startAddTranslation() {
        this.isAddingTranslation.set(true);
        this.newTranslationLanguage = '';
        this.newTranslationText = '';
    }

    protected cancelAddTranslation() {
        this.isAddingTranslation.set(false);
    }

    protected async saveNewTranslation() {
        if (!this.jobAd()) {
            return;
        }

        await this.jobService.addTranslation(
            this.jobAd()!.id,
            this.newTranslationLanguage,
            this.newTranslationText,
        );

        const updatedJob = await this.jobService.getJobAd(this.jobAd()!.id);
        this.jobAd.set(updatedJob);
        this.isAddingTranslation.set(false);
    }

    protected startDeleteTranslation() {
        this.isDeletingTranslation.set(true);
        this.translationToDelete = '';
    }

    protected cancelDeleteTranslation() {
        this.isDeletingTranslation.set(false);
    }

    protected async deleteTranslation() {
        if (!this.jobAd() || !this.translationToDelete) {
            return;
        }

        await this.jobService.deleteTranslation(this.jobAd()!.id, this.translationToDelete);

        const updatedJob = await this.jobService.getJobAd(this.jobAd()!.id);
        this.jobAd.set(updatedJob);
        this.isDeletingTranslation.set(false);

        if (this.selectedLanguage() === this.translationToDelete) {
            this.selectedLanguage.set('en');
        }
    }

    async autoTranslate() {
        if (!this.newTranslationLanguage || !this.jobAd()) {
            return;
        }

        try {
            const englishText = this.jobAd()?.textEN;
            if (!englishText) {
                return;
            }

            const translatedText = await this.jobService.translateText(
                englishText,
                'en',
                this.newTranslationLanguage,
            );

            this.newTranslationText = translatedText;
        } catch (err) {
            alert('Sorry, could not translate.');
        }
    }
}
