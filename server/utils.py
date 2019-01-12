import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import os
import json

save_dir = 'plots'

def get_df(filename='data-12-22-18.csv'):
    df = pd.read_csv(filename)
    df['correct'] = (df.true == df.pred)
    df['(true=1,pred=1)'] = (df.true == 1) &  (df.pred == 1)
    df['(true=1,pred=0)'] = (df.true == 1) &  (df.pred == 0)
    df['(true=0,pred=1)'] = (df.true == 0) &  (df.pred == 1)
    df['(true=0,pred=0)'] = (df.true == 0) &  (df.pred == 0)
    df = df[df.gender.isin(['male', 'female'])]

    return df

def plot_user_effort(df, save=False):   
    effort = np.array(df.groupby('uid').id.nunique().tolist())
    remaining = [np.sum(np.array(effort) >= 6*n) for n in range(1,11)]
    effort = [np.sum(effort//6 == i) for i in range(1,11)]

    fig = plt.figure(figsize=(12,4))
    ax1 = fig.add_subplot(121)
    ax2 = fig.add_subplot(122)
    ax1.bar(range(1,11), effort, color="blue")
    ax2.bar(range(1,11), remaining, color="darkblue")
    ax1.set_title("Num users who completed EXACTLY N trials")
    ax2.set_title("Num users who completed AT LEAST N trials")
    fig.tight_layout()
    
    if save:
        fig.savefig(os.path.join(save_dir, 'user_effort.png'))  
    return fig

def plot_user_age(df, save=False):
    fs = 20
    tfs = 15
    fig = plt.figure(figsize=(12,4))
    ax1 = fig.add_subplot(121)
    ax2 = fig.add_subplot(122)

    ax1.set_title("Age distribution (Non-Expert Users)", fontsize=fs)
    ax2.set_title("Age distribution (Expert Users)", fontsize=fs)
    ax1.set_xlabel("age in years", fontsize=fs)
    ax2.set_xlabel("age in years", fontsize=fs)
    ax1.set_ylabel("fraction of users", fontsize=fs)
    ax2.set_ylabel("fraction of users", fontsize=fs)
    ax1.hist(df[df.expert==0].age, bins=20, range=(18,80), color="g", density=True)
    ax2.hist(df[df.expert==1].age, bins=20, range=(18,80), color="m", density=True)

    ax1.xaxis.set_tick_params(labelsize=tfs)
    ax1.yaxis.set_tick_params(labelsize=tfs)
    ax2.xaxis.set_tick_params(labelsize=tfs)
    ax2.yaxis.set_tick_params(labelsize=tfs)
    fig.tight_layout()
    
    if save:
        fig.savefig(os.path.join(save_dir, 'user_age.png'))
    return fig

def get_user_stats(df, save=False):
    started = df.uid.nunique()
    finished = sum(df.groupby('uid').id.nunique() >= 60)
    experts = df[df.expert==1].uid.nunique()
    nonexperts = df[df.expert==0].uid.nunique()
    men = df[df.gender=='male'].uid.nunique()
    women = df[df.gender=='female'].uid.nunique()
    
    data = {
        'started': started,
        'finished': finished,
        'experts': experts,
        'nonexperts': nonexperts,
        'men': men,
        'women': women,
    }
    
    if save:
        with open(os.path.join(save_dir, 'user_stats.json'), 'w') as out:
            json.dump(data, out)
    return data
                    
df = get_df()
plot_user_effort(df, save=True)
plot_user_age(df, save=True)
get_user_stats(df, save=True)
        