If you think a killer robot is in the making to destroy mankind, just no, I’m not Tony Stark. Now why the heck is the title referencing the second Avenger’s movie? Well… let’s talk about a real world Ultron for climate change.

## An Oversimplification of Large Language Models
Large language models (LLM). If you’ve never heard of one... well ChatGPT. If you don’t know what that is… I encourage you to google it, and make sure to give it a try.

Essentially, an LLM is a machine learning tool which has the goal of predicting and generating text based on an input. The “large” denotes the extensive number of parameters the model possesses. How large? Try 100s of millions to over a billion parameters. The foundation for these models is something called a transformer. A transformer will take the input and determine the importance of various parts. Through this, it can learn intricate patterns and relationships in data resulting in an accurate humanlike response to your input.

## Idea -> -> -> 10x
If you’ve watched the Avengers: Age of Ultron movie, you’ll know Tony Stark had the goal of creating an artificial intelligence that could save the world from alien threats. It ended with the robot “Ultron” going rogue, gaining access to the internet, downloading every piece (yes every piece) of information ever to exist on the internet… and concluding peace meant humans going extinct.

I’m here to tell you that isn’t the idea.

Can we rewind a little though? Did Ultron download every piece of information, process it (who knows what importance he associated each parameter), and come to a single conclusion? Yes.

So what’s the goal of my idea? Imagine an LLM that is so large and able to combine the current data available in every major industry. Imagine the decision making and advanced analytics it could provide. Let’s call it Opus.

{{image:1}}

Example. There are currently many startups working in the agriculture space. Startups such as CropX. They use sensors in soil to manage irrigation, nutrition and disease management. Their sensors are worldwide and all this data is combined into a global data center. They are literally saving our food supply with sensors in soil.

Ok, a second startup, Sierra Energy. They take trash and turn it into renewable energy. Its a 2 for 1 deal! You inevitably have garbage. Now it doesn’t go into a landfill AND it gets turned into synthesis gas.

So what if we took the data of both these startups and let Opus have a look. Hypothetically, there are infinite possibilities. But let’s say given all the data, Opus concluded we needed to back CropX 100% and ignore Sierra. Maybe Opus has found that food insecurity is a 10x more pressing problem for the fate of humanity. 70% of our water goes to agriculture, and we need to increase our crop yields by 70% by 2050.

There are many examples, but this is the gist of it.

## Some Obvious Issues and Important Notes
Let’s look at our above example. From a purely numbers-driven standpoint, the rationale is clear (for our example). Seventy percent of our water goes into agriculture, and given escalating populations, increasing crop yield becomes paramount. But what about Sierra Energy? The implications of Opus's decision extend beyond mere analytics.

Think of the employees, stakeholders, and communities intertwined with Sierra Energy. A decision to shift focus entirely to CropX could mean potential layoffs, disappointed investors, and communities left without a sustainable waste management solution.

This scenario underscores an important point: even the most sophisticated AI, armed with petabytes of data, lacks the ethics of humans. It can't fathom the nuanced intricacies of socio-economic repercussions or the emotional ramifications of its choices.

Thus, while Opus's recommendations could be a guiding light, they will never overshadow human judgment. Every suggestion, while grounded in vast data, needs to be filtered through layers of human understanding, ethics, and societal implications. The goal is to have this delicate dance between man and machine that will pave the path for a future that's not only technologically advanced but also ethically sound.

## Let's Begin Building

Let’s start with some basic assumptions before building begins.

- We have the capital.

- We have the data in hand. We’ve pre-trained and fine-tuned the data with some help (I’ll explain later).

First, let’s deal with computing power and it’s limitations. The creation of large language models takes a tremendous amount of computing power. For reference, OpenAI spent $3.2 million on computing to train Chat GPT-3. It used 285,000 processor cores and 10,000 graphics cards, totaling around 800 petaflops of power (that’s 800,000,000 gigaflops - my i9 can theoretically use 980 gigaflops). So how do we overcome this when training Opus? Short answer, we can’t avoid it. Long answer… we can try and optimize the process.

To tackle these computational challenges, Distributed Training becomes a key strategy. Distributed training involves training our model across multiple GPUs or even across different servers. This is a necessity for handling vast datasets and mammoth-sized models. By adopting distributed training, we can ensure the model trains faster, efficiently utilizes memory resources, and scales with the data and complexity we're introducing.

There are two primary ways we'll harness distributed training:

1. Data Parallelism: Our model will be duplicated across multiple GPUs. Each will get a different subset of the training data, process it, and then we'll aggregate the computed gradients from all GPUs to update our model.

2. Model Parallelism: Considering Opus's sheer size, parts of the model will reside on different GPUs. This ensures even extremely large models can be accommodated by splitting them across the available hardware.

{{image:2}}

However, diving into distributed training isn't without its challenges. Communication between GPUs becomes crucial. Efficiently passing and aggregating data ensures we don't hit bottlenecks. By using model and data parallelism, we’re able to scale our model extremely quickly by leveraging multiple GPU’s. We’re also able to improve generalization - the models ability to perform well on new data resulting in more accurate predictions and conclusions.

Now we can move on to the pre-training and fine-tuning which links to a feedback cycle. Here, we’ll be collaborating with many institutions and domain expertise. They’ll be guiding the training process as well as the feedback cycle.

Why are these parties important and how exactly are they going to help us? They’ll be helping us by suggesting important topics and sources. They’re experts in their respective fields. They’ll be able to review the models accuracy and relevance. They’ll provide diverse perspectives. They’ll be able to monitor the output for biases. Now it should be noted that specific guidelines will be implemented to ensure human reviewers understand political and economic implications of the climate solutions provided.

## Final Thoughts

Through examples such as CropX and Sierra Energy, we catch a glimpse of Opus's capabilities. By merging and analyzing these vast datasets, we could unlock strategies to tackle these pressing global challenges, from food insecurity to sustainable waste management. The opportunities seem endless. Yet, the example also serves as a poignant reminder that AI, no matter how advanced, lacks the deeply ingrained human touch. Opus might favor one solution over another based purely on numbers, but real-world decisions have layered consequences, entwining lives, communities, and economies.

Adding on a few key learnings:

Collaborative intelligence - the future is about AI with humans, not AI vs humans. LLMs like Opus will augment our capabilities. However, the core decision making will be left to humans.

Endless Potential - from the very first day ChatGPT was released, LLMs changed the world. With the constant improvements and tremendous capabilities of synthesizing large datasets from diverse fields, the innovations and breakthroughs sitting on the horizon line etch ever so close.

This idea came to be in a sprint session through ari global. Although a high level overview about what really needs to be done. I’ve come to deepen my understanding of LLMs and their shear capabilities. Note that these are my own conclusions and research.

---
I'm always open to hearing new perspectives. You can reach me on linkedin or twitter.