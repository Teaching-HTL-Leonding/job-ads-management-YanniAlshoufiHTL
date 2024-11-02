import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

const apiUrl = 'http://localhost:3000' as const;

export type JobAd = {
    id: number;
    title: string;
    textEN: string;
    translations?: {
        language: string;
        translatedText: string;
    }[];
};

@Injectable({
    providedIn: 'root',
})
export class JobService {
    private readonly client = inject(HttpClient);

    async getJobAds(): Promise<JobAd[]> {
        const ads = this.client.get<JobAd[]>(`${apiUrl}/ads`);
        return await firstValueFrom(ads);
    }

    async getJobAd(id: number): Promise<JobAd> {
        const ad = this.client.get<JobAd>(`${apiUrl}/ads/${id}`);
        return await firstValueFrom(ad);
    }

    async deleteJobAd(id: number): Promise<void> {
        const deleted = this.client.delete(`${apiUrl}/ads/${id}`);
        await firstValueFrom(deleted);
    }

    async updateJobAd(id: number, title: string, textEN: string): Promise<void> {
        const updated = this.client.patch(`${apiUrl}/ads/${id}`, { title, textEN });
        await firstValueFrom(updated);
    }
}
