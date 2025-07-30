import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { cn } from '@/lib/utils';

interface RegionTreeNode {
    id: number;
    name: string;
    subRegions: RegionTreeNode[];
}

const RegionsTree = () => {
    const { t, language, isRTL } = useLanguage();
    const [treeData, setTreeData] = useState<RegionTreeNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchRegionsTree = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/admin/regions/tree', {
                    headers: {
                        'Accept-Language': language,
                    },
                });
                if (response.data.success) {
                    setTreeData(response.data.data);
                } else {
                    toast.error(t('failedToFetchRegionsTree'));
                    setError(t('failedToFetchRegionsTree'));
                }
            } catch (err) {
                toast.error(t('failedToFetchRegionsTree'));
                setError(t('failedToFetchRegionsTree'));
            } finally {
                setLoading(false);
            }
        };

        fetchRegionsTree();
    }, [language, t]);

    const toggleNode = (nodeId: number) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
            } else {
                newSet.add(nodeId);
            }
            return newSet;
        });
    };

    const openAll = () => {
        const getAllIds = (nodes: RegionTreeNode[]): number[] => {
            return nodes.reduce((ids: number[], node) => {
                return [
                    ...ids,
                    node.id,
                    ...(node.subRegions ? getAllIds(node.subRegions) : [])
                ];
            }, []);
        };
        const allIds = getAllIds(treeData);
        setExpandedNodes(new Set(allIds));
    };

    const closeAll = () => {
        setExpandedNodes(new Set());
    };

    const renderTree = (nodes: RegionTreeNode[], level = 0) => {
        const paddingValue = level * 24;
        const itemStyle = isRTL
            ? { paddingRight: `${paddingValue + 16}px` }
            : { paddingLeft: `${paddingValue + 16}px` };

        return nodes.map(node => (
            <div key={node.id}>
                <div
                    className="flex items-center justify-between py-3 px-4 border-b border-border hover:bg-accent/50 transition-colors"
                    style={itemStyle}
                >
                    <div className="flex items-center gap-3">
                        {node.subRegions && node.subRegions.length > 0 ? (
                            <button
                                onClick={() => toggleNode(node.id)}
                                className="text-primary hover:text-primary/80"
                            >
                                {expandedNodes.has(node.id) ? (
                                    <ChevronDown className={cn("h-4 w-4", isRTL ? "rotate-180" : "")} />
                                ) : (
                                    <ChevronRight className={cn("h-4 w-4", isRTL ? "rotate-180" : "")} />
                                )}
                            </button>
                        ) : (
                            <div className="w-4" />
                        )}
                        <span className="font-medium text-foreground">{node.name}</span>
                    </div>
                </div>
                {expandedNodes.has(node.id) && node.subRegions && node.subRegions.length > 0 && (
                    <div>
                        {renderTree(node.subRegions, level + 1)}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <AdminLayout loading={loading}>
            <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-foreground">{t('regionsTree')}</CardTitle>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={openAll}
                            className="text-primary border-border hover:bg-accent"
                        >
                            {t('openAll')}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={closeAll}
                            className="text-primary border-border hover:bg-accent"
                        >
                            {t('closeAll')}
                        </Button>
                        <Button asChild>
                            <Link to="/regions">{t('backToRegions')}</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        {treeData.length === 0 && !loading && !error ? (
                            <div className="flex flex-col justify-center items-center h-32 text-muted-foreground">
                                <svg className="text-primary" fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100px" height="100px" viewBox="0 0 59.227 59.227" xmlSpace="preserve">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                    <g id="SVGRepo_iconCarrier"> <g> <g> <path d="M51.586,10.029c-0.333-0.475-0.897-0.689-1.449-0.607c-0.021-0.005-0.042-0.014-0.063-0.017L27.469,6.087 c-0.247-0.037-0.499-0.01-0.734,0.076L8.63,12.799c-0.008,0.003-0.015,0.008-0.023,0.011c-0.019,0.008-0.037,0.02-0.057,0.027 c-0.099,0.044-0.191,0.096-0.276,0.157c-0.026,0.019-0.051,0.038-0.077,0.059c-0.093,0.076-0.178,0.159-0.249,0.254 c-0.004,0.006-0.01,0.009-0.014,0.015L0.289,23.78c-0.293,0.401-0.369,0.923-0.202,1.391c0.167,0.469,0.556,0.823,1.038,0.947 l6.634,1.713v16.401c0,0.659,0.431,1.242,1.062,1.435l24.29,7.422c0.008,0.004,0.017,0.001,0.025,0.005 c0.13,0.036,0.266,0.059,0.402,0.06c0.003,0,0.007,0.002,0.011,0.002l0,0h0.001c0.143,0,0.283-0.026,0.423-0.067 c0.044-0.014,0.085-0.033,0.13-0.052c0.059-0.022,0.117-0.038,0.175-0.068l17.43-9.673c0.477-0.265,0.772-0.767,0.772-1.312 V25.586l5.896-2.83c0.397-0.19,0.69-0.547,0.802-0.973c0.111-0.427,0.03-0.88-0.223-1.241L51.586,10.029z M27.41,9.111 l17.644,2.59L33.35,17.143l-18.534-3.415L27.41,9.111z M9.801,15.854l21.237,3.914l-6.242,9.364l-20.78-5.365L9.801,15.854z M10.759,43.122V28.605l14.318,3.697c0.125,0.031,0.25,0.048,0.375,0.048c0.493,0,0.965-0.244,1.248-0.668l5.349-8.023v25.968 L10.759,43.122z M49.479,41.1l-14.431,8.007V25.414l2.635,5.599c0.171,0.361,0.479,0.641,0.854,0.773 c0.163,0.06,0.333,0.087,0.502,0.087c0.223,0,0.444-0.05,0.649-0.146l9.789-4.698L49.479,41.1L49.479,41.1z M39.755,28.368 l-4.207-8.938L49.85,12.78l5.634,8.037L39.755,28.368z" /> </g> </g> </g>
                                </svg>
                                {t('noDataAvailable')}
                            </div>
                        ) : error ? (
                            <div className="text-red-500">{error}</div>
                        ) : (
                            renderTree(treeData)
                        )}
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
};

export default RegionsTree; 