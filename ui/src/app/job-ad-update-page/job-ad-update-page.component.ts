import { Component, inject, signal } from '@angular/core';
import { JobService } from '../job.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JobAd } from '../job.service';
import { FormsModule } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-job-ad-update-page',
    standalone: true,
    imports: [RouterLink, FormsModule],
    templateUrl: './job-ad-update-page.component.html',
    styleUrl: './job-ad-update-page.component.css',
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                style({ transform: 'translateY(-100%)' }),
                animate('150ms ease-in', style({ transform: 'translateY(0)' })),
            ]),
            transition(':leave', [
                animate('150ms ease-in', style({ transform: 'translateY(-100%)' })),
            ]),
        ]),
    ],
})
export class JobAdUpdatePageComponent {
    private readonly jobService = inject(JobService);
    private readonly route = inject(ActivatedRoute);
    protected readonly jobAd = signal<JobAd | undefined>(undefined);
    protected shouldShowSuccess = signal<boolean>(false);

    protected readonly newTitle = signal<string>('');
    protected readonly newTextEN = signal<string>('');

    async ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.jobAd.set(await this.jobService.getJobAd(id));
        this.newTitle.set(this.jobAd()!.title);
        this.newTextEN.set(this.jobAd()!.textEN);
    }

    async onSubmit() {
        await this.jobService.updateJobAd(this.jobAd()!.id, this.newTitle(), this.newTextEN());
        this.shouldShowSuccess.set(true);
        setTimeout(() => this.shouldShowSuccess.set(false), 2000);
    }
}
