import fs from 'fs';
import https from 'https';
import { pull } from './pull';
import type { Keyset } from '../core/builder/types';

jest.mock('fs');
jest.mock('https');

const exampleKeyset: Keyset = {
    'What is love?': {
        en: 'What is love?',
        ru: 'Что такое любовь?',
    },
};

describe('synchronizer/pull', () => {
    const authToken = 'test-token';
    const exampleFilePath = 'path/to/example.i18n.js';
    const exampleFiles = [
        {
            filePath: exampleFilePath,
            keyset: exampleKeyset,
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update local files with translations from localang.xyz', (done) => {
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readFile as unknown as jest.Mock).mockImplementation(
            (_filePath, _encoding, callback) => {
                callback(null, 'const keyset = {};');
            },
        );
        const request = {
            on: jest.fn(),
            end: jest.fn(),
        };

        (https.request as jest.Mock).mockImplementation(
            (_options, callback) => {
                const res = {
                    on: jest.fn((event, handler) => {
                        if (event === 'data') {
                            handler(
                                JSON.stringify({
                                    status: 'success',
                                    files: exampleFiles,
                                }),
                            );
                        }
                        if (event === 'end') {
                            handler();
                        }
                    }),
                };

                callback(res);
                return request;
            },
        );

        pull(authToken);

        process.nextTick(() => {
            expect(https.request).toHaveBeenCalledWith(
                {
                    hostname: 'https://localang.xyz',
                    port: 443,
                    path: '/api/translations/getAll',
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                },
                expect.any(Function),
            );

            expect(request.on).toHaveBeenCalledWith(
                'error',
                expect.any(Function),
            );
            expect(request.end).toHaveBeenCalled();

            expect(fs.existsSync).toHaveBeenCalledWith(exampleFilePath);
            expect(fs.readFile).toHaveBeenCalledWith(
                exampleFilePath,
                'utf8',
                expect.any(Function),
            );
            expect(fs.writeFileSync).toHaveBeenCalledWith(
                exampleFilePath,
                expect.stringContaining(
                    'const keyset = {\n    "What is love?": {\n        en: "What is love?",\n        ru: "Что такое любовь?"\n    }\n};',
                ),
            );

            done();
        });
    });

    it('should handle non-existing files', (done) => {
        (fs.existsSync as jest.Mock).mockReturnValue(false);

        const request = {
            on: jest.fn(),
            end: jest.fn(),
        };

        (https.request as jest.Mock).mockImplementation((_options, callback) => {
            const res = {
                on: jest.fn((event, handler) => {
                    if (event === 'data') {
                        handler(
                            JSON.stringify({
                                status: 'success',
                                files: exampleFiles,
                            }),
                        );
                    }
                    if (event === 'end') {
                        handler();
                    }
                }),
            };

            callback(res);
            return request;
        });

        pull(authToken);

        process.nextTick(() => {
            expect(fs.existsSync).toHaveBeenCalledWith(exampleFilePath);
            expect(fs.readFile).not.toHaveBeenCalled();

            done();
        });
    });

    it('should throw error if file reading fails', (done) => {
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readFile as unknown as jest.Mock).mockImplementation(
            (_filePath, _encoding, callback) => {
                callback(new Error('Read error'));
            },
        );

        const request = {
            on: jest.fn(),
            end: jest.fn(),
        };

        (https.request as jest.Mock).mockImplementation((_options, callback) => {
            const res = {
                on: jest.fn((event, handler) => {
                    if (event === 'data') {
                        handler(
                            JSON.stringify({
                                status: 'success',
                                files: exampleFiles,
                            }),
                        );
                    }
                    if (event === 'end') {
                        handler();
                    }
                }),
            };

            callback(res);
            return request;
        });

        expect(() => {
            pull(authToken);
        }).toThrowError(
            'Error reading file path/to/example.i18n.js: Read error',
        );

        process.nextTick(() => {
            expect(fs.readFile).toHaveBeenCalledWith(
                exampleFilePath,
                'utf8',
                expect.any(Function),
            );
            done();
        });
    });

    it('should throw error if request fails', (done) => {
        const request = {
            on: jest.fn((event, handler) => {
                if (event === 'error') {
                    handler(new Error('Request error'));
                }
            }),
            end: jest.fn(),
        };

        (https.request as jest.Mock).mockImplementation(() => request);

        expect(() => {
            pull(authToken);
        }).toThrowError('Error syncing keysets: Request error');

        process.nextTick(() => {
            expect(request.on).toHaveBeenCalledWith(
                'error',
                expect.any(Function),
            );
            done();
        });
    });
});
