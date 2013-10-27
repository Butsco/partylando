//
//  UserProfile.m
//  Partylando
//
//  Created by Roberto Dries on 26/10/13.
//  Copyright (c) 2013 Youbba. All rights reserved.
//

#import "UserProfile.h"

@implementation UserProfile

@synthesize name = _name;
@synthesize image = _image;

-(void)initData{
    self.userPartyData = [[NSMutableDictionary alloc]initWithObjectsAndKeys:
                          [NSNumber numberWithInt:2],@"top",
                          [NSNumber numberWithInt:1],@"bottom",
                          [NSNumber numberWithInt:2],@"shoes",
                          [NSNumber numberWithInt:0],@"top_cat",
                          [NSNumber numberWithInt:0],@"bottom_cat",
                          [NSNumber numberWithInt:0],@"shoes_cat",
     nil];
}

-(void) setUserImage:(NSString *)profileImage{
    if(!profileImage || profileImage.length ==0){
        _image = [UIImage imageNamed:@"noImage"];
    }else{
        [[SDWebImageManager sharedManager]
         downloadWithURL:[NSURL URLWithString:profileImage]
         options:0
         progress:Nil
         completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, BOOL finished)
         {
             if (image)
             {
                 _image = image;
             }
         }];
    }
}
#pragma warning still need to check
-(NSDictionary *) JSONForUserItems{
    NSMutableDictionary *items= [[NSMutableDictionary alloc]init];
    for (NSString *key in [self.userPartyData allKeys]) {
        [items setObject:[self.userPartyData objectForKey:key] forKey:key];
    }
    return items;
}
@end
