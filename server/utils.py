import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import os
import json


def get_df(filename='data-12-22-18.csv'):
    df = pd.read_csv(filename)
    df['correct'] = (df.true == df.pred)
    df['(true=1,pred=1)'] = (df.true == 1) &  (df.pred == 1)
    df['(true=1,pred=0)'] = (df.true == 1) &  (df.pred == 0)
    df['(true=0,pred=1)'] = (df.true == 0) &  (df.pred == 1)
    df['(true=0,pred=0)'] = (df.true == 0) &  (df.pred == 0)
    df = df[df.gender.isin(['male', 'female'])]

    return df

def plot_user_effort(df, save=False, save_dir='static/plots'):   
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

def plot_user_age(df, save=False, save_dir='static/plots'):
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

def get_user_stats(df, save=False, save_dir='static/plots'):
    started = df.uid.nunique()
    finished = sum(df.groupby('uid').id.nunique() >= 60)
    experts = df[df.expert==1].uid.nunique()
    nonexperts = df[df.expert==0].uid.nunique()
    men = df[df.gender=='male'].uid.nunique()
    women = df[df.gender=='female'].uid.nunique()
    expert_men = df[(df.gender=='male') & (df.expert==1)].uid.nunique()
    nonexpert_men = df[(df.gender=='male') & (df.expert==0)].uid.nunique()
    expert_women = df[(df.gender=='female') & (df.expert==1)].uid.nunique()
    nonexpert_women = df[(df.gender=='female') & (df.expert==0)].uid.nunique()
    
    data = {
        'started': started,
        'finished': finished,
        'experts': experts,
        'nonexperts': nonexperts,
        'men': men,
        'women': women,
        'expert_men': expert_men,
        'nonexpert_men': nonexpert_men,
        'expert_women': expert_women,
        'nonexpert_women': nonexpert_women,
    }
    
    if save:
        with open(os.path.join(save_dir, 'user_stats.json'), 'w') as out:
            json.dump(data, out)
    return data


def conf_interval(N, p_success):
    return (1.96/N)*np.sqrt(p_success*(1-p_success)*N) #95% conf interval


def get_results(df, columns):
    results = df.groupby(columns).agg({
        'uid': 'nunique',
        'id': 'nunique',
        'true': 'sum',
        'correct': 'sum',
        '(true=1,pred=1)': 'sum',
        '(true=0,pred=1)':'sum',
        '(true=1,pred=0)': 'sum',
        '(true=0,pred=0)': 'sum',
    }).reset_index()
    
    results['accuracy'] = results.correct / results.id   
    results['accuracy_conf'] = conf_interval(results.id, results.accuracy)
    
    results['(pred=1|true=1)'] = results['(true=1,pred=1)'] / results.true
    results['(pred=0|true=1)'] = results['(true=1,pred=0)'] / results.true
    results['(pred=1|true=0)'] = results['(true=0,pred=1)'] / (results.id - results.true)
    results['(pred=0|true=0)'] = results['(true=0,pred=0)'] / (results.id - results.true)

    results['(pred=1|true=1)_conf'] = conf_interval(results.true, results['(pred=1|true=1)'])
    results['(pred=0|true=1)_conf'] = conf_interval(results.true, results['(pred=0|true=1)'])
    results['(pred=1|true=0)_conf'] = conf_interval(results.id-results.true, results['(pred=1|true=0)'])
    results['(pred=0|true=0)_conf'] = conf_interval(results.id-results.true, results['(pred=0|true=0)'])

    return results
 

def plot_accuracy_fpr(df, save=False, save_dir='static/plots'):
    expert_results = get_results(df, ['expt_id', 'duration', 'expert'])

    fig = plt.figure(figsize=(12,16))
    fs = 20
    tfs = 15

    ax1 = fig.add_subplot(211)
    ax1.set_title("Overall Accuracy vs. Time Shown", fontsize=fs)
    ax1.set_xlabel("Time Shown (ms)", fontsize=fs)
    ax1.set_ylabel("Accuracy = P(true == pred)", fontsize=fs)
    ax2 = fig.add_subplot(212)
    ax2.set_title("Fake Image FPR vs. Time Shown", fontsize=fs)
    ax2.set_xlabel("Time Shown (ms)", fontsize=fs)
    ax2.set_ylabel("FPR = P(pred=1|true=0)", fontsize=fs)

    id_map = [
        (1, "Experts; Exp 1 (real vs GAN)", "m", "-", True), 
        (2, "Experts; Exp 2 (real vs GAN; no eyes)", "m", "--", True),
        (1, "Non-Experts; Exp 1 (real vs GAN)", "g", "-", False), 
        (2, "Non-Experts; Exp 2 (real vs GAN; no eyes)", "g", "--", False)
    ]

    for (expt_id, label, color, linestyle, expert)  in id_map:
        exp_data = expert_results[(expert_results.expt_id == expt_id) & (expert_results.expert == expert)]
        ax1.errorbar(exp_data.duration, exp_data['accuracy'], yerr=exp_data['accuracy_conf'],
                     color=color, linestyle=linestyle, marker='o', label=label, capsize=4)
        ax2.errorbar(exp_data.duration, exp_data['(pred=1|true=0)'], yerr=exp_data['(pred=1|true=0)_conf'],
                     color=color, linestyle=linestyle, marker='o', label=label, capsize=4)

    ax1.axhline(y=0.5, color="k", linestyle="--", label="Random Guessing = 0.5")
    ax1.legend(loc=0, fontsize=tfs)
    ax1.xaxis.set_tick_params(labelsize=tfs)
    ax1.yaxis.set_tick_params(labelsize=tfs)

    ax2.axhline(y=0.5, color="k", linestyle="--", label="Random Guessing = 0.5")
    ax2.legend(loc=0, fontsize=tfs)
    ax2.xaxis.set_tick_params(labelsize=tfs)
    ax2.yaxis.set_tick_params(labelsize=tfs)

    fig.tight_layout()
    
    if save:
        fig.savefig(os.path.join(save_dir, 'accuracy_fpr.png'))
    return fig
    
    
def plot_gender_accuracy_fpr(df, expert_filter=None, save=False, save_dir='static/plots'):
    gender_results = get_results(df, ['expt_id', 'duration', 'gender'])
    expert_gender_results = get_results(df, ['expt_id', 'duration', 'expert', 'gender'])
    subtitle = "" if expert_filter is None else ("(Experts)" if expert_filter else "(Non-Experts)")

    fs = 20
    tfs = 15

    fig = plt.figure(figsize=(12,16))
    ax1 = fig.add_subplot(211)
    ax1.set_title("Face Classification Overall Accuracy vs. Time Shown %s" % subtitle, fontsize=fs)
    ax1.set_xlabel("Time Shown (ms)", fontsize=fs)
    ax1.set_ylabel("Accuracy = P(true == pred)", fontsize=fs)
    ax2 = fig.add_subplot(212)
    ax2.set_title("Fake Image FPR vs. Time Shown %s" % subtitle, fontsize=fs)
    ax2.set_xlabel("Time Shown (ms)", fontsize=fs)
    ax2.set_ylabel("FPR = P(pred=1|true=0)", fontsize=fs)

    gender_id_map = {
        ('male', 1):("Male; Exp 1 (real vs GAN)", "b", "-"), 
        ('male', 2):("Male; Exp 2 (real vs GAN; no eyes)", "b", "--"),
        ('female', 1):("Female; Exp 1 (real vs GAN)", "r", "-"), 
        ('female', 2):("Female; Exp 2 (real vs GAN; no eyes)", "r", "--")
    }


    for (gender, expt_id), (label, color, linestyle)  in gender_id_map.items():
        if expert_filter is not None:
            exp_data = expert_gender_results[(expert_gender_results.expert == expert_filter) &
                                             (expert_gender_results.gender == gender) & 
                                             (expert_gender_results.expt_id == expt_id)]
        else:
            exp_data = gender_results[(gender_results.gender == gender) & 
                                      (gender_results.expt_id == expt_id)]

        ax1.errorbar(exp_data.duration, exp_data['accuracy'], yerr=exp_data['accuracy_conf'],
                     color=color, linestyle=linestyle, marker='o', label=label, capsize=4)
        ax2.errorbar(exp_data.duration, exp_data['(pred=1|true=0)'], yerr=exp_data['(pred=1|true=0)_conf'],
                     color=color, linestyle=linestyle, marker='o', label=label, capsize=4)


    ax1.axhline(y=0.5, color="k", linestyle="--", label="Random Guessing = 0.5")
    ax1.legend(loc=0, fontsize=tfs)
    ax1.xaxis.set_tick_params(labelsize=tfs)
    ax1.yaxis.set_tick_params(labelsize=tfs)

    ax2.axhline(y=0.5, color="k", linestyle="--", label="Random Guessing = 0.5")
    ax2.legend(loc=0, fontsize=tfs)
    ax2.xaxis.set_tick_params(labelsize=tfs)
    ax2.yaxis.set_tick_params(labelsize=tfs)
    
    fig.tight_layout()
    if save:
        fig.savefig(os.path.join(save_dir, 'gender_accuracy_fpr.png'))
    return fig
