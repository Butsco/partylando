//
//  ItemsViewController.m
//  Partylando
//
//  Created by Roberto Dries on 26/10/13.
//  Copyright (c) 2013 Youbba. All rights reserved.
//

#import "ItemsViewController.h"
#import "HorizontalTableViewCell.h"

@interface ItemsViewController ()

@end

@implementation ItemsViewController{
    NSMutableDictionary *categoryAndItems;
    NSArray *keysOnly;
}


- (void)viewDidLoad
{
    [super viewDidLoad];
    [self loadSampleData];
    keysOnly = [categoryAndItems allKeys];
    //[self.tableView registerClass:[HorizontalTableViewCell class] forCellReuseIdentifier:@"horizontalCell"];

}

#pragma mark - Table view



-(UIView *) tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section{
    UILabel *title = [[UILabel alloc]initWithFrame:CGRectMake(10, 0, tableView.frame.size.width-10, 30)];
    UIView *headerView = [[UIView alloc]initWithFrame:CGRectMake(0, 0, tableView.frame.size.width, 30)];
    
    [title setFont:[UIFont boldSystemFontOfSize:15]];
    [title setTextColor:[UIColor whiteColor]];
    [title setText: [keysOnly objectAtIndex:section]];
    
    
    [headerView setBackgroundColor:[UIColor orangeColor]];
    [headerView addSubview:title];
    

    return headerView;
}
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    
    /*UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
     
     if (cell == nil)
     {
     cell = [[[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier] autorelease];
     }
     */
    HorizontalTableViewCell *cell = (HorizontalTableViewCell *)[tableView dequeueReusableCellWithIdentifier:@"horizontalCell"];
    if(!cell){
        //cell = [[HorizontalTableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"horizontalCell"];
        cell = [[HorizontalTableViewCell alloc] initWithFrame:CGRectMake(0, 0, 320, 100)];
    }
    cell.items = (NSArray *) [categoryAndItems objectForKey:[keysOnly objectAtIndex:indexPath.section]];
    
    return cell;
}
- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return keysOnly.count;
}
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return 1;
}
- (void)loadSampleData{
    
    NSArray *top = [[NSArray alloc]initWithObjects:
                    [NSDictionary dictionaryWithObjectsAndKeys:@"temp",@"image",@"Bloes",@"description",@"10",@"price", nil],
                    [NSDictionary dictionaryWithObjectsAndKeys:@"temp",@"image",@"Jas",@"description",@"8",@"price", nil],
                    [NSDictionary dictionaryWithObjectsAndKeys:@"temp",@"image",@"Shirt",@"description",@"3",@"price", nil],
                    [NSDictionary dictionaryWithObjectsAndKeys:@"temp",@"image",@"Jas",@"description",@"8",@"price", nil],
                    [NSDictionary dictionaryWithObjectsAndKeys:@"temp",@"image",@"Shirt",@"description",@"3",@"price", nil],
                    [NSDictionary dictionaryWithObjectsAndKeys:@"temp",@"image",@"Jas",@"description",@"8",@"price", nil],
                    [NSDictionary dictionaryWithObjectsAndKeys:@"temp",@"image",@"Shirt",@"description",@"3",@"price", nil],
                    [NSDictionary dictionaryWithObjectsAndKeys:@"temp",@"image",@"Jas",@"description",@"8",@"price", nil],
                    [NSDictionary dictionaryWithObjectsAndKeys:@"temp",@"image",@"Shirt",@"description",@"3",@"price", nil],nil];
    
    NSArray *bottom = [[NSArray alloc]initWithObjects:
                    [NSDictionary dictionaryWithObjectsAndKeys:@"temp",@"image",@"broek",@"description",@"30",@"price", nil],
                    [NSDictionary dictionaryWithObjectsAndKeys:@"temp",@"image",@"kleed",@"description",@"18",@"price", nil],
                    [NSDictionary dictionaryWithObjectsAndKeys:@"temp",@"image",@"short",@"description",@"13",@"price", nil],nil];
    
    NSArray *shoes = [[NSArray alloc]initWithObjects:
                       [NSDictionary dictionaryWithObjectsAndKeys:@"temp",@"image",@"nike",@"description",@"80",@"price", nil],
                       [NSDictionary dictionaryWithObjectsAndKeys:@"temp",@"image",@"addidas",@"description",@"48",@"price", nil],
                       [NSDictionary dictionaryWithObjectsAndKeys:@"temp",@"image",@"armani",@"description",@"130",@"price", nil],nil];
    
    
    categoryAndItems = [NSMutableDictionary dictionaryWithObjectsAndKeys:
                        top, @"top",
                        bottom, @"bottom",
                        shoes,@"shoes", nil];
    
   
    
}



 

@end
