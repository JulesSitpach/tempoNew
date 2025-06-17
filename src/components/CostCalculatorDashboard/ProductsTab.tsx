import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Download,
  Eye,
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface ProductsTabProps {
  data: any[];
  totalOriginalCost: number;
  totalNewCost: number;
  totalImpact: number;
  highImpactItems: any[];
  criticalItems: any[];
  language: string;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
  data,
  totalOriginalCost,
  totalNewCost,
  totalImpact,
  highImpactItems,
  criticalItems,
  language
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('impact');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | 'high' | 'critical'>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;
  };

  const getImpactColor = (impact: number) => {
    if (Math.abs(impact) > 20) return 'text-red-600';
    if (Math.abs(impact) > 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getImpactIcon = (impact: number) => {
    return impact > 0 ? (
      <TrendingUp className="h-4 w-4 text-red-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-green-500" />
    );
  };

  const getRiskLevel = (item: any) => {
    const impact = ((item.newCost - item.originalCost) / item.originalCost) * 100;
    if (Math.abs(impact) > 20) return 'critical';
    if (Math.abs(impact) > 10) return 'high';
    if (Math.abs(impact) > 5) return 'medium';
    return 'low';
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'high': return <Badge variant="secondary">High</Badge>;
      case 'medium': return <Badge variant="outline">Medium</Badge>;
      default: return <Badge variant="default">Low</Badge>;
    }
  };

  // Filter and sort data
  const filteredData = data
    .filter(item => {
      const matchesSearch = item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      const riskLevel = getRiskLevel(item);
      if (filterType === 'critical' && riskLevel !== 'critical') return false;
      if (filterType === 'high' && !['critical', 'high'].includes(riskLevel)) return false;
      
      return true;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'sku':
          aValue = a.sku || '';
          bValue = b.sku || '';
          break;
        case 'originalCost':
          aValue = a.originalCost || 0;
          bValue = b.originalCost || 0;
          break;
        case 'newCost':
          aValue = a.newCost || 0;
          bValue = b.newCost || 0;
          break;
        case 'tariffRate':
          aValue = a.tariffRate || 0;
          bValue = b.tariffRate || 0;
          break;
        case 'impact':
        default:
          aValue = ((a.newCost - a.originalCost) / a.originalCost) * 100;
          bValue = ((b.newCost - b.originalCost) / b.originalCost) * 100;
          break;
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-8 p-2 font-medium"
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? <SortAsc className="ml-1 h-3 w-3" /> : <SortDesc className="ml-1 h-3 w-3" />
      )}
    </Button>
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Products</div>
            <div className="text-2xl font-bold">{data.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">High Impact</div>
            <div className="text-2xl font-bold text-yellow-600">{highImpactItems.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Critical Risk</div>
            <div className="text-2xl font-bold text-red-600">{criticalItems.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Impact</div>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalImpact)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-64">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by SKU or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="border rounded px-3 py-2 text-sm"
                title="Filter by risk level"
                aria-label="Filter products by risk level"
              >
                <option value="all">All Products</option>
                <option value="high">High Impact</option>
                <option value="critical">Critical Only</option>
              </select>
            </div>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export Products
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Analysis Details</CardTitle>
          <p className="text-sm text-muted-foreground">
            Showing {filteredData.length} of {data.length} products
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <SortButton field="sku">SKU</SortButton>
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">
                    <SortButton field="originalCost">Original Cost</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton field="tariffRate">Tariff Rate</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton field="newCost">New Cost</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton field="impact">Impact</SortButton>
                  </TableHead>
                  <TableHead className="text-center">Risk Level</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item, index) => {
                  const impact = ((item.newCost - item.originalCost) / item.originalCost) * 100;
                  const riskLevel = getRiskLevel(item);
                  
                  return (
                    <TableRow key={item.id || index} className={riskLevel === 'critical' ? 'bg-red-50' : ''}>
                      <TableCell className="font-medium">{item.sku}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={item.description}>
                          {item.description}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.originalCost)}
                      </TableCell>
                      <TableCell className="text-right">
                        {(item.tariffRate || 0).toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.newCost)}
                      </TableCell>
                      <TableCell className={`text-right ${getImpactColor(impact)}`}>
                        <div className="flex items-center justify-end gap-1">
                          {getImpactIcon(impact)}
                          <span className="font-medium">
                            {formatPercentage(impact)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(item.newCost - item.originalCost)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {getRiskBadge(riskLevel)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No products match your current search and filter criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Critical Items Alert */}
      {criticalItems.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Critical Impact Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 mb-4">
              {criticalItems.length} products have critical tariff impact (>20%) and require immediate attention.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {criticalItems.slice(0, 6).map((item, index) => (
                <div key={index} className="bg-white p-3 rounded border border-red-200">
                  <div className="font-medium text-sm">{item.sku}</div>
                  <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                  <div className="text-sm font-medium text-red-600 mt-1">
                    Impact: {formatPercentage(((item.newCost - item.originalCost) / item.originalCost) * 100)}
                  </div>
                </div>
              ))}
            </div>
            {criticalItems.length > 6 && (
              <div className="mt-4 text-center">
                <Badge variant="outline" className="text-red-600">
                  +{criticalItems.length - 6} more critical items
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
