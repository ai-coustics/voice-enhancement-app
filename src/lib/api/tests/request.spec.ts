import { describe, it, expect, vi, beforeEach } from 'vitest';
import { request, RequestError } from '../request';

const apiRoot = 'https://example.com/api';

function mockResponse(status = 200, data = {}, statusText = 'OK') {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    json: vi.fn().mockResolvedValue(data)
  };
};

const mockFetch = vi.fn().mockImplementation(() => {
  return mockResponse();
});
vi.stubGlobal('fetch', mockFetch);

describe('request', () => {

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('makes a correct GET request with URL and parameters', async () => {
    // Test with parameters that need URL encoding
    const params = {
      query: 'search term with spaces',
      filter: 'category=books&author=Spacey Space',
      special: '!@#$%^&*()'
    };

    await request(apiRoot, 'search', params);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://example.com/api/search?query=search+term+with+spaces&filter=category%3Dbooks%26author%3DSpacey+Space&special=%21%40%23%24%25%5E%26*%28%29',
      expect.objectContaining({
        method: 'GET',
        body: undefined
      })
    );
  });

  it('makes a POST with multipart/form-data when payload is provided', async () => {
    const payload = { file: 'test-file', name: 'test-name', dummy1: undefined, dummy2: null };
    await request(apiRoot, 'upload', undefined, payload);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://example.com/api/upload',
      expect.objectContaining({
        method: 'POST',
      })
    );

    const fetchCall = mockFetch.mock.calls[0];
    const body = fetchCall[1].body;
    expect(body).toBeInstanceOf(FormData);
    expect(body.get('file')).toBe('test-file');
    expect(body.get('name')).toBe('test-name');
    expect(body.get('dummy1')).toBe(null);
    expect(body.get('dummy2')).toBe(null);
  });

  it('returns response', async () => {
    const responseData = { id: 1, name: 'Corvin' };
    mockFetch.mockResolvedValueOnce(mockResponse(200, responseData));

    const result = await request(apiRoot, 'users/1');
    const json = await result.json();

    expect(json).toEqual(responseData);
  });

  it('throws RequestError when server returns an error', async () => {
    mockFetch.mockResolvedValueOnce(
      mockResponse(404, { error: { message: 'Resource not found' } }, 'Not Found')
    );

    await expect(
      request(apiRoot, 'users/999')
    ).rejects.toThrow(RequestError);
  });

  it('includes error details from the response', async () => {
    mockFetch.mockResolvedValueOnce(
      mockResponse(404, { detail: 'Resource not found' }, 'Not Found')
    );

    await expect(
      request(apiRoot, 'users/999')
    ).rejects.toMatchObject({
      statusCode: 404,
      statusText: 'Not Found',
      message: 'Resource not found'
    });
  });

  it('handles errors where no json is provided', async () => {
    const mockErrorResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: vi.fn().mockRejectedValue(new Error('No JSON'))
    };
    mockFetch.mockResolvedValueOnce(mockErrorResponse);

    await expect(
      request(apiRoot, 'users')
    ).rejects.toMatchObject({
      statusCode: 500,
      statusText: 'Internal Server Error',
      message: 'Unknown error.'
    });
  });
});
