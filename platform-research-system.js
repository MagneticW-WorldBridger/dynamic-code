/**
 * AI PRL Assist - Platform Research System
 * Keeps embedding instructions up-to-date automatically
 */

class PlatformResearchSystem {
    constructor() {
        this.platforms = [
            'gohighlevel',
            'webflow', 
            'wordpress',
            'shopify',
            'squarespace',
            'wix',
            'elementor',
            'duda'
        ];
        
        this.apiEndpoints = {
            serper: 'https://google.serper.dev/search',
            openai: 'https://api.openai.com/v1/chat/completions'
        };
        
        this.searchQueries = {
            gohighlevel: [
                'GoHighLevel custom JavaScript embed 2024',
                'GoHighLevel footer tracking code HTML',
                'GoHighLevel custom code integration latest'
            ],
            webflow: [
                'Webflow custom code embed 2024 methods',
                'Webflow HTML embed widget integration',
                'Webflow custom code paid plan requirements'
            ],
            wordpress: [
                'WordPress custom JavaScript widget embed 2024',
                'WordPress theme footer code injection',
                'WordPress plugin custom code best practices'
            ],
            shopify: [
                'Shopify theme liquid custom code 2024',
                'Shopify widget embed theme modification',
                'Shopify custom JavaScript integration'
            ],
            squarespace: [
                'Squarespace code injection 2024 methods',
                'Squarespace custom HTML widget embed',
                'Squarespace business plan code requirements'
            ]
        };
    }

    /**
     * Research all platforms and update instructions
     */
    async researchAllPlatforms() {
        console.log('🔍 Starting daily platform research...');
        
        const results = {};
        
        for (const platform of this.platforms) {
            try {
                console.log(`Researching ${platform}...`);
                const instructions = await this.researchPlatform(platform);
                results[platform] = instructions;
                
                // Wait between requests to avoid rate limits
                await this.delay(2000);
            } catch (error) {
                console.error(`Error researching ${platform}:`, error);
                results[platform] = { error: error.message };
            }
        }
        
        // Save results
        await this.saveResearchResults(results);
        
        console.log('✅ Platform research completed');
        return results;
    }

    /**
     * Research specific platform embedding methods
     */
    async researchPlatform(platform) {
        const queries = this.searchQueries[platform] || [`${platform} custom code embed 2024`];
        const searchResults = [];
        
        // Perform multiple searches for comprehensive results
        for (const query of queries) {
            try {
                const results = await this.performSearch(query);
                searchResults.push(...results);
            } catch (error) {
                console.error(`Search error for ${query}:`, error);
            }
        }
        
        // Analyze results with AI
        const analysis = await this.analyzeWithAI(platform, searchResults);
        
        return {
            platform,
            lastUpdated: new Date().toISOString(),
            instructions: analysis.instructions,
            requirements: analysis.requirements,
            limitations: analysis.limitations,
            confidence: analysis.confidence,
            sources: searchResults.slice(0, 5) // Keep top 5 sources
        };
    }

    /**
     * Perform web search using Serper API
     */
    async performSearch(query) {
        const response = await fetch(this.apiEndpoints.serper, {
            method: 'POST',
            headers: {
                'X-API-KEY': process.env.SERPER_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: query,
                num: 10,
                hl: 'en',
                gl: 'us'
            })
        });
        
        if (!response.ok) {
            throw new Error(`Serper API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.organic || [];
    }

    /**
     * Analyze search results with OpenAI
     */
    async analyzeWithAI(platform, searchResults) {
        const prompt = `
        Analyze the following search results about embedding custom JavaScript widgets on ${platform}.
        
        Extract:
        1. Step-by-step embedding instructions
        2. Plan requirements (free/paid)
        3. Limitations or restrictions
        4. Best practices
        5. Recent changes (2024)
        
        Search Results:
        ${searchResults.map(result => `
        Title: ${result.title}
        Snippet: ${result.snippet}
        URL: ${result.link}
        `).join('\n')}
        
        Provide a JSON response with:
        {
            "instructions": ["step1", "step2", ...],
            "requirements": "plan requirements",
            "limitations": ["limitation1", "limitation2"],
            "confidence": 0.9,
            "lastVerified": "2024-01-15"
        }
        `;
        
        const response = await fetch(this.apiEndpoints.openai, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert web developer who analyzes platform documentation and provides accurate embedding instructions.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.1,
                max_tokens: 1000
            })
        });
        
        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }
        
        const data = await response.json();
        const content = data.choices[0].message.content;
        
        try {
            return JSON.parse(content);
        } catch (error) {
            // Fallback if JSON parsing fails
            return {
                instructions: [content],
                requirements: 'Unknown',
                limitations: [],
                confidence: 0.5,
                lastVerified: new Date().toISOString()
            };
        }
    }

    /**
     * Save research results to file system
     */
    async saveResearchResults(results) {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `platform-research-${timestamp}.json`;
        
        const data = {
            generatedAt: new Date().toISOString(),
            platforms: results,
            nextUpdate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        };
        
        // In a real implementation, save to database or file system
        console.log(`💾 Saving research results to ${filename}`);
        console.log(JSON.stringify(data, null, 2));
        
        return filename;
    }

    /**
     * Generate updated control panel with latest instructions
     */
    async updateControlPanel() {
        const latestResearch = await this.getLatestResearch();
        
        // Generate new control panel HTML with updated instructions
        const updatedHTML = this.generateControlPanelHTML(latestResearch);
        
        // Save updated control panel
        // In production, this would update the actual file
        console.log('🔄 Control panel updated with latest platform instructions');
        
        return updatedHTML;
    }

    /**
     * Get latest research results
     */
    async getLatestResearch() {
        // In production, load from database or file system
        // For now, return mock data
        return {
            gohighlevel: {
                instructions: [
                    'Navigate to Settings → Custom Code',
                    'Use Footer Tracking Code section',
                    'Paste widget code',
                    'Save changes'
                ],
                requirements: 'Works on all plans',
                confidence: 0.95
            }
        };
    }

    /**
     * Schedule daily updates
     */
    scheduleDailyUpdates() {
        // Run every 24 hours
        setInterval(async () => {
            console.log('⏰ Starting scheduled platform research...');
            await this.researchAllPlatforms();
            await this.updateControlPanel();
        }, 24 * 60 * 60 * 1000);
        
        console.log('📅 Daily platform research scheduled');
    }

    /**
     * Utility: Delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Generate control panel HTML with updated instructions
     */
    generateControlPanelHTML(researchData) {
        // This would generate the actual HTML with updated platform instructions
        return `<!-- Updated control panel with latest platform instructions -->`;
    }
}

// Export for use in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlatformResearchSystem;
}

// Usage example:
/*
const researchSystem = new PlatformResearchSystem();

// Run once
researchSystem.researchAllPlatforms();

// Schedule daily updates
researchSystem.scheduleDailyUpdates();
*/
