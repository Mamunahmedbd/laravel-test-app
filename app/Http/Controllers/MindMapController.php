<?php

namespace App\Http\Controllers;

use App\Models\MindMap;
use Illuminate\Http\Request;
use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Log;
use OpenAI\Factory;
use GuzzleHttp\Client as GuzzleClient;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Middleware;
use Symfony\Component\HttpClient\HttpClient;

class MindMapController extends Controller
{
    public function generate(Request $request)
    {
        try {
            $request->validate([
                'content' => 'required|string',
                'title' => 'required|string',
                'settings' => 'nullable|array'
            ]);

            Log::info('Generating mind map', [
                'title' => $request->title,
                'content_length' => strlen($request->content)
            ]);

            // Create a custom HTTP client with optimized settings
            $stack = HandlerStack::create();

            // Add retry middleware
            $stack->push(Middleware::retry(function ($retries, $request, $response) {
                // Retry on timeout or server errors
                return $retries < 3 && (
                    $response === null ||
                    $response->getStatusCode() >= 500
                );
            }, function ($retries) {
                // Exponential backoff
                return 1000 * (2 ** $retries);
            }));

            $httpClient = new GuzzleClient([
                'handler' => $stack,
                'timeout' => 60,
                'connect_timeout' => 10,
                'read_timeout' => 60,
                'verify' => false,
                'curl' => [
                    CURLOPT_TCP_KEEPALIVE => 1,
                    CURLOPT_TCP_KEEPIDLE => 60,
                    CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
                    CURLOPT_DNS_USE_GLOBAL_CACHE => true,
                    CURLOPT_DNS_CACHE_TIMEOUT => 600,
                    CURLOPT_SSL_VERIFYPEER => false,
                    CURLOPT_SSL_VERIFYHOST => 0,
                ],
            ]);

            // Create a new OpenAI client with the custom HTTP client
            $openAIClient = (new Factory())
                ->withApiKey(config('openai.api_key'))
                ->withOrganization(config('openai.organization'))
                ->withHttpClient($httpClient)
                ->make();

            $response = $openAIClient->chat()->create([
                'model' => 'gpt-4',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a mind map generator that creates structured, hierarchical mind maps from text content. Your task is to analyze the input content and generate a JSON structure that represents a mind map.

Key requirements:
1. Structure:
   - Create a clear hierarchical structure with a central topic and related subtopics
   - Limit the depth to 3-4 levels for clarity
   - Ensure logical connections between nodes
   - Follow a horizontal layout pattern with nodes positioned from left to right

2. Node Properties:
   - id: Unique identifier (string)
   - position: {x, y} coordinates for layout
   - data: {label: string} containing the node text
   - type: "default" for regular nodes, "input" for input nodes
   - parentId: ID of parent node (for hierarchical structure)
   - sourcePosition: "right" for nodes that have children
   - targetPosition: "left" for nodes that have parents

3. Edge Properties:
   - id: Unique identifier (string)
   - source: ID of source node
   - target: ID of target node
   - type: "smoothstep" for curved connections

4. Layout Guidelines:
   - Position nodes in a balanced, horizontal layout
   - Maintain consistent spacing between nodes (approximately 250px horizontally)
   - Ensure no overlapping nodes
   - Keep the central node at (0,0)
   - Position child nodes to the right of their parents
   - Use vertical spacing (approximately 160px) between sibling nodes

5. Initial Structure Example:
   {
     "nodes": [
       {
         "id": "horizontal-1",
         "sourcePosition": "right",
         "type": "input",
         "data": { "label": "Input" },
         "position": { "x": 0, "y": 80 }
       },
       {
         "id": "horizontal-2",
         "sourcePosition": "right",
         "targetPosition": "left",
         "data": { "label": "A Node" },
         "position": { "x": 250, "y": 0 }
       },
       {
         "id": "horizontal-3",
         "sourcePosition": "right",
         "targetPosition": "left",
         "data": { "label": "Node 3" },
         "position": { "x": 250, "y": 160 }
       }
     ],
     "edges": [
       {
         "id": "e1-2",
         "source": "horizontal-1",
         "target": "horizontal-2",
         "type": "smoothstep"
       },
       {
         "id": "e1-3",
         "source": "horizontal-1",
         "target": "horizontal-3",
         "type": "smoothstep",
         "animated": true
       }
     ]
   }

Return only valid JSON with nodes and edges arrays. Do not include any explanatory text.'
                    ],
                    [
                        'role' => 'user',
                        'content' => "Generate a mind map structure for the following content, responding with JSON only: {$request->content}"
                    ]
                ],
                'temperature' => 0.7,
                'max_tokens' => 2000
            ]);

            Log::info('OpenAI response received', [
                'response' => $response->choices[0]->message->content
            ]);

            $structure = json_decode($response->choices[0]->message->content, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('Invalid JSON response from OpenAI: ' . json_last_error_msg());
            }

            $mindMap = MindMap::create([
                'title' => $request->title,
                'content' => $request->content,
                'structure' => $structure,
                'settings' => $request->settings ?? [
                    'maxDepth' => 3,
                    'style' => [
                        'centralNode' => ['color' => '#4A90E2'],
                        'primaryNodes' => ['color' => '#50C878'],
                        'secondaryNodes' => ['color' => '#FFB366'],
                        'tertiaryNodes' => ['color' => '#FF7F7F']
                    ]
                ]
            ]);

            return response()->json($mindMap);
        } catch (\Exception $e) {
            Log::error('Error generating mind map', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Failed to generate mind map',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show(MindMap $mindMap)
    {
        return response()->json($mindMap);
    }
}