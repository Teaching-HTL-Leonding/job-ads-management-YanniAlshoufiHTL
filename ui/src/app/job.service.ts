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

    async addTranslation(id: number, language: string, translatedText: string): Promise<void> {
        const updated = this.client.put(`${apiUrl}/ads/${id}/translations/${language}`, {
            translatedText,
        });
        await firstValueFrom(updated);
    }

    async deleteTranslation(id: number, language: string): Promise<void> {
        const deleted = this.client.delete(`${apiUrl}/ads/${id}/translations/${language}`);
        await firstValueFrom(deleted);
    }

    async translateText(text: string, fromLang: string, toLang: string): Promise<string> {
        const translation = this.client.post<{ translation: string }>(
            `${apiUrl}/deepl/v2/translate`,
            {
                text,
                source_lang: fromLang,
                target_lang: toLang,
            },
        );
        return (await firstValueFrom(translation)).translation;
    }
}
